from backend.database import SessionLocal, engine
from backend import models, security

print("Creating database tables...")
models.Base.metadata.create_all(bind=engine)

def seed():
    db = SessionLocal()

    # Create dummy users
    if not db.query(models.User).first():
        print("Seeding Users...")
        hashed_pw = security.get_password_hash("password123")
        student = models.User(email="student@buildora.com", hashed_password=hashed_pw, full_name="Alice Student", role=models.UserRole.STUDENT)
        developer = models.User(email="dev@buildora.com", hashed_password=hashed_pw, full_name="Bob Developer", role=models.UserRole.DEVELOPER)
        db.add(student)
        db.add(developer)
        db.commit()

    # Get users
    student = db.query(models.User).filter_by(email="student@buildora.com").first()
    developer = db.query(models.User).filter_by(email="dev@buildora.com").first()

    # Create mock projects
    if not db.query(models.Project).first():
        print("Seeding Projects...")
        projects_data = [
            models.Project(
                title="AI Resume Reviewer",
                description="A Python-based AI application that analyzes resumes against Job Descriptions using OpenAI. Returns a match score and missing keywords. Perfect for Final Year GenAI project.",
                domain="machine-learning",
                tech_stack="Python, FastAPI, Streamlit, Langchain",
                tier1_price=1499,
                tier2_price=2499,
                owner_id=developer.id
            ),
            models.Project(
                title="Blockchain Voting DApp",
                description="Secure voting system built on Ethereum testnet. Uses Truffle for smart contracts and React for the frontend. Includes full voting lifecycle from registration to tallying.",
                domain="blockchain",
                tech_stack="React, Solidity, Hardhat, Ethers.js",
                tier1_price=1999,
                tier2_price=3499,
                owner_id=developer.id
            ),
            models.Project(
                title="Advanced IoT Weather Station",
                description="Complete code for ESP32 and a React-based monitoring dashboard. Collects temp, humidity, pressure, and predicts local rain using simple linear regression.",
                domain="iot",
                tech_stack="C++, React, Node.js, Firebase",
                tier1_price=1200,
                tier2_price=1800,
                owner_id=developer.id
            )
        ]
        db.add_all(projects_data)
        db.commit()

    # Create mock Open Gigs (CustomRequests)
    if not db.query(models.CustomRequest).first():
        print("Seeding Custom Requests...")
        requests_data = [
            models.CustomRequest(
                title="College Bus Tracking App",
                description="Need a simple Android app and admin panel for tracking our college buses via GPS. Real-time location updates needed on a maps interface.",
                budget_range="₹8,000 - ₹12,000",
                deadline="April 20th",
                status=models.CustomRequestStatus.OPEN,
                student_id=student.id
            ),
            models.CustomRequest(
                title="Facial Recognition Attendance",
                description="A Python script to take attendance from a webcam feed using OpenCV. Must store records in a local SQLite DB and export to excel.",
                budget_range="₹4,000 - ₹6,000",
                deadline="Early May",
                status=models.CustomRequestStatus.OPEN,
                student_id=student.id
            )
        ]
        db.add_all(requests_data)
        db.commit()

    print("Seeding Complete!")
    db.close()

if __name__ == "__main__":
    seed()
