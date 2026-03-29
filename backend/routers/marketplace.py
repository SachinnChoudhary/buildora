from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database, security

router = APIRouter(
    prefix="/api/projects",
    tags=["Projects"]
)

@router.get("/", response_model=List[schemas.ProjectResponse])
def list_projects(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    projects = db.query(models.Project).offset(skip).limit(limit).all()
    return projects

@router.get("/{project_id}", response_model=schemas.ProjectResponse)
def get_project(project_id: int, db: Session = Depends(database.get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("/upload", response_model=schemas.ProjectResponse)
def upload_project(
    project_in: schemas.ProjectCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    if current_user.role != models.UserRole.DEVELOPER:
        raise HTTPException(status_code=403, detail="Must be a developer to upload projects")
        
    db_obj = models.Project(
        **project_in.model_dump(),
        owner_id=current_user.id
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

