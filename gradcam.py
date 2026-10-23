import os
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from pytorch_grad_cam.utils.image import show_cam_on_image


# =========================================================
# CONFIGURATION
# =========================================================

MODEL_PATH = r"C:\Users\arvin\Downloads\OcularScreenAI\ai-model\models\anemia_final.pth"

IMAGE_PATH = r"C:\Users\arvin\Downloads\OcularScreenAI\ai-model\real_world_test\image24.jpg"

OUTPUT_DIR = r"C:\Users\arvin\Downloads\OcularScreenAI\ai-model\real_world_test\gradcam"

os.makedirs(OUTPUT_DIR, exist_ok=True)

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

CLASSES = ["anemia", "no_anemia"]


# =========================================================
# LOAD MODEL
# =========================================================

print("Loading OcularScreenAI model...")

model = models.resnet18(weights=None)

num_features = model.fc.in_features

model.fc = nn.Sequential(
    nn.Dropout(0.30),
    nn.Linear(num_features, 128),
    nn.ReLU(inplace=True),
    nn.Dropout(0.25),
    nn.Linear(128, 2)
)


checkpoint = torch.load(
    MODEL_PATH,
    map_location=DEVICE
)

if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
    model.load_state_dict(checkpoint["model_state_dict"])
else:
    model.load_state_dict(checkpoint)


model = model.to(DEVICE)
model.eval()

print("Model loaded successfully.")
print("Device:", DEVICE)


# =========================================================
# IMAGE TRANSFORMATION
# =========================================================

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# =========================================================
# LOAD IMAGE
# =========================================================

print("\nLoading image:")
print(IMAGE_PATH)

image = Image.open(IMAGE_PATH).convert("RGB")

input_tensor = transform(image).unsqueeze(0).to(DEVICE)


# =========================================================
# PREDICTION
# =========================================================

with torch.no_grad():

    output = model(input_tensor)

    probabilities = torch.softmax(output, dim=1)

    predicted_class = torch.argmax(probabilities, dim=1).item()

    confidence = probabilities[0][predicted_class].item() * 100


print("\n======================================")
print("PREDICTION")
print("======================================")

print("Predicted Class :", CLASSES[predicted_class])
print("Confidence      :", f"{confidence:.2f}%")

print("\nClass Probabilities:")

for i, class_name in enumerate(CLASSES):
    print(
        f"{class_name}: "
        f"{probabilities[0][i].item() * 100:.2f}%"
    )


# =========================================================
# GRAD-CAM
# =========================================================

print("\nGenerating Grad-CAM...")

# Last convolutional layer of ResNet18
target_layers = [model.layer4[-1]]

cam = GradCAM(
    model=model,
    target_layers=target_layers
)

targets = [
    ClassifierOutputTarget(predicted_class)
]


grayscale_cam = cam(
    input_tensor=input_tensor,
    targets=targets
)

grayscale_cam = grayscale_cam[0]


# =========================================================
# PREPARE ORIGINAL IMAGE
# =========================================================

import numpy as np

# Resize image properly for Grad-CAM visualization
display_image = image.resize((224, 224))

rgb_image = np.array(display_image).astype(np.float32) / 255.0


# =========================================================
# CREATE HEATMAP
# =========================================================

visualization = show_cam_on_image(
    rgb_image,
    grayscale_cam,
    use_rgb=True
)


# =========================================================
# SAVE RESULT
# =========================================================

filename = os.path.splitext(
    os.path.basename(IMAGE_PATH)
)[0]

output_path = os.path.join(
    OUTPUT_DIR,
    f"gradcam_{filename}.jpg"
)

Image.fromarray(visualization).save(output_path)


print("\n======================================")
print("GRAD-CAM COMPLETE")
print("======================================")

print("Output saved at:")
print(output_path)

print("\nThe highlighted regions show the image areas")
print("that contributed to the model prediction.")