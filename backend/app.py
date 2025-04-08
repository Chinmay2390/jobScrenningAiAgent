from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import ollama
import pdfplumber
import json
import re

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart



from dotenv import load_dotenv
load_dotenv()

import smtplib
from email.message import EmailMessage


EMAIL_ADDRESS = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASS")

app = Flask(__name__)
# CORS(app)  # Enable CORS for frontend communication
CORS(app, supports_credentials=True, origins=["https://job-screnning-ai-agent.vercel.app"])


DB_PATH = 'resumes.db'  # Path to SQLite database


def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()


def extract_resume_details(text):
    prompt = f"""
    Extract the following details from this resume:
    - Name
    - Email
    - Phone Number
    - Skills (list)
    - Years of Experience
    - Education
    - Summary
    - Certificate
    - Achievement

    Resume Text:
    {text}

    Provide the output in **strict JSON format**, without markdown or comments.
    """
    response = ollama.chat(model="llama3", messages=[{"role": "user", "content": prompt}])

    if "message" in response and "content" in response["message"]:
        return clean_json_response(response["message"]["content"])
    else:
        return {}


def store_resume_data(data):
    conn = sqlite3.connect("resumes.db")
    cursor = conn.cursor()

    experience = data.get("years_of_experience", "Unknown")
    education = json.dumps(data.get("education", []))
    certifications = json.dumps(data.get("certificate", []))
    achievements = json.dumps(data.get("achievement", []))

    cursor.execute('''
        INSERT INTO resumes (name, email, phone, skills, experience, education, summary, certification, achievement)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data.get("name", "Unknown"),
        data.get("email", "Unknown"),
        data.get("phone", "Unknown"),
        ", ".join(data.get("skills", [])),
        str(experience),
        education,
        data.get("summary", "Unknown"),
        certifications,
        achievements,
    ))

    conn.commit()
    conn.close()


def clean_json_response(response_text):
    try:
        return json.loads(response_text)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", response_text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                return {}
    return {}

def get_db_connection():
    """Establish a connection to the SQLite database."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Enables fetching rows as dictionaries
    return conn


@app.route('/')
def home():
    return 'Job Screening AI Agent Backend is Running!'


@app.route('/jobs', methods=['GET'])
def get_jobs():
    """Fetch job listings from the job_description table (only id, title, and description)."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, title, description FROM job_descriptions")
    jobs = cursor.fetchall()
    
    conn.close()
    
    jobs_list = [dict(job) for job in jobs]  # Convert row objects to dictionaries
    return jsonify(jobs_list)


@app.route('/jobs', methods=['POST'])
def add_job():
    """Insert a new job listing into the database (only title and description)."""
    data = request.json
    if not data.get("title") or not data.get("description"):
        return jsonify({"error": "Title and description are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO job_descriptions (title, description) VALUES (?, ?)",
        (data.get("title"), data.get("description"))
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Job added successfully"}), 201


@app.route('/apply', methods=['POST'])
def apply():
    resume_file = request.files.get('resume')

    if not resume_file:
        return jsonify({'error': 'Resume file is required'}), 400

    # Make sure the uploads directory exists
    os.makedirs('uploads', exist_ok=True)

    # Save the uploaded file
    resume_path = os.path.join('uploads', resume_file.filename)
    resume_file.save(resume_path)

    # Extract text from the saved PDF
    resume_text = extract_text_from_pdf(resume_path)

    # Use LLM to extract structured data
    resume_data = extract_resume_details(resume_text)

    # Store extracted resume data in SQLite
    store_resume_data(resume_data)

    return jsonify({'message': 'Resume parsed and stored successfully!'}), 200


@app.route('/api/job_descriptions', methods=['GET'])
def get_job_descriptions():
    conn = sqlite3.connect('your_db.sqlite')
    cur = conn.cursor()
    cur.execute("SELECT id, title FROM job_descriptions")
    jobs = [{'id': str(row[0]), 'title': row[1]} for row in cur.fetchall()]
    conn.close()
    return jsonify(jobs)

@app.route('/top_applicants', methods=['GET'])
def top_applicants():
    conn = sqlite3.connect('resumes.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Get all job descriptions
    cursor.execute("SELECT id, title FROM job_descriptions")
    jobs = cursor.fetchall()

    result = []

    for job in jobs:
        job_id = job['id']
        job_title = job['title']

        # Get top applicants for this job (excluding Unknown)
        cursor.execute("""
            SELECT 
                rm.resume_name,
                r.email,
                r.skills,
                rm.score
            FROM resume_matches rm
            JOIN resumes r ON rm.resume_name = r.name
            WHERE rm.job_id = ? AND rm.resume_name != 'Unknown'
            ORDER BY rm.score DESC
            LIMIT 3
        """, (job_id,))

        applicants = cursor.fetchall()
        top_applicants = []

        for applicant in applicants:
            top_applicants.append({
                "name": applicant['resume_name'],
                "email": applicant['email'],
                "skills": applicant['skills'],
                "score": applicant['score']
            })

        result.append({
            "job_id": job_id,
            "job_title": job_title,
            "top_applicants": top_applicants
        })

    conn.close()
    return jsonify(result)


@app.route('/send_mail', methods=['POST'])
def send_mail():
    data = request.json
    email = data.get('email')
    name = data.get('name')
    job_title = data.get('job_title')

    if not email:
        return jsonify({"error": "Email required"}), 400

    # Compose email
    msg = EmailMessage()
    msg['Subject'] = f'Shortlisting for {job_title} Role'
    msg['From'] = 'chinmaykamlaskar@example.com'
    email = 'chinmaypatil2023@gmail.com'
    msg['To'] = email
    msg.set_content(f"""
    Hi {name},

    Congratulations! You have been shortlisted for the position of {job_title}.
    We will contact you with further steps.

    Regards,
    HR Team
    """)

    # Send email
    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
            smtp.starttls()
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)  # Use app password if using Gmail
            smtp.send_message(msg)
        return jsonify({'message': 'Email sent successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True, port=5000)
