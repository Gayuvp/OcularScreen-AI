from fastapi import (

    FastAPI,

    UploadFile,

    File,

    Depends,

    HTTPException

)



from fastapi.middleware.cors import CORSMiddleware

from fastapi.staticfiles import StaticFiles

from sqlalchemy.orm import Session



import shutil

import os

import uuid



# ==================================================

# DATABASE

# ==================================================



from database import (

    engine,

    Base,

    get_db

)



import models as db_models





# ==================================================

# ROUTERS

# ==================================================



from auth import router as auth_router

from history import router as history_router





# ==================================================

# AI LIBRARIES

# ==================================================



import torch

import torch.nn as nn



from torchvision import (

    models as tv_models,

    transforms

)
