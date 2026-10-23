import os
import sys
import torch
import torch.nn as nn

from PIL import Image
from torchvision import transforms, models


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "anemia_final.pth"
)

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

IMAGE_SIZE = 224

# Minimum image size for attempting prediction
MIN_WIDTH = 150
MIN_HEIGHT = 150


# ============================================================
# IMAGE TRANSFORMATION
# ============================================================

transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# ============================================================
# EYE REGION CROP
# ============================================================

def crop_eye_region(image):

    width, height = image.size

    left = int(width * 0.10)
    right = int(width * 0.90)

    top = int(height * 0.25)
    bottom = int(height * 0.72)

    cropped = image.crop(
        (left, top, right, bottom)
    )

    return cropped


# ============================================================
# CREATE MODEL
# MUST MATCH TRAINING ARCHITECTURE
# ============================================================

model = models.resnet18(weights=None)

num_features = model.fc.in_features

model.fc = nn.Sequential(
    nn.Dropout(0.30),

    nn.Linear(
        num_features,
        128
    ),

    nn.ReLU(inplace=True),

    nn.Dropout(0.25),

    nn.Linear(
        128,
        2
    )
)


# ============================================================
# LOAD MODEL
# ============================================================

try:

    checkpoint = torch.load(
        MODEL_PATH,
        map_location=DEVICE
    )

    # V1 model was saved as a checkpoint
    if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:

        model.load_state_dict(
            checkpoint["model_state_dict"]
        )

        CLASS_NAMES = checkpoint.get(
            "classes",
            ["anemia", "no_anemia"]
        )

    else:

        # Fallback if the model was saved directly
        model.load_state_dict(
            checkpoint
        )

        CLASS_NAMES = [
            "anemia",
            "no_anemia"
        ]

except Exception as e:

    print("\n❌ ERROR LOADING MODEL")
    print(e)
    sys.exit(1)


model = model.to(DEVICE)

model.eval()


print("✅ AI model loaded successfully!")
print("Model:", MODEL_PATH)
print("Classes:", CLASS_NAMES)
print("Device:", DEVICE)


# ============================================================
# PREDICTION FUNCTION
# ============================================================

def get_prediction(input_image):

    image_tensor = transform(
        input_image
    )

    image_tensor = image_tensor.unsqueeze(0)

    image_tensor = image_tensor.to(
        DEVICE
    )

    with torch.no_grad():

        outputs = model(
            image_tensor
        )

        probabilities = torch.softmax(
            outputs,
            dim=1
        )

        predicted_class = torch.argmax(
            probabilities,
            dim=1
        )

    predicted_index = (
        predicted_class.item()
    )

    predicted_label = (
        CLASS_NAMES[predicted_index]
    )

    anemia_probability = (
        probabilities[0][0].item() * 100
    )

    no_anemia_probability = (
        probabilities[0][1].item() * 100
    )

    confidence = max(
        anemia_probability,
        no_anemia_probability
    )

    return (
        predicted_label,
        confidence,
        anemia_probability,
        no_anemia_probability
    )


# ============================================================
# PREDICT IMAGE
# ============================================================

def predict_image(image_path):

    # --------------------------------------------------------
    # OPEN IMAGE
    # --------------------------------------------------------

    try:

        image = Image.open(
            image_path
        ).convert("RGB")

    except Exception as e:

        print(
            f"\n❌ Cannot open image: {e}"
        )

        return


    # --------------------------------------------------------
    # IMAGE SIZE
    # --------------------------------------------------------

    width, height = image.size

    print(
        f"\nOriginal image size: "
        f"{width} x {height}"
    )


    # --------------------------------------------------------
    # IMAGE QUALITY CHECK
    # --------------------------------------------------------

    if width < MIN_WIDTH or height < MIN_HEIGHT:

        print("\n" + "=" * 65)

        print(
            "⚠️ IMAGE QUALITY WARNING"
        )

        print("=" * 65)

        print(
            "\nThis image is too small for reliable screening."
        )

        print(
            f"Minimum recommended size: "
            f"{MIN_WIDTH} x {MIN_HEIGHT}"
        )

        print(
            f"Current image size: "
            f"{width} x {height}"
        )

        print(
            "\nPrediction skipped."
        )

        print("=" * 65)

        return


    # ========================================================
    # CREATE CROPPED IMAGE
    # ========================================================

    cropped_image = crop_eye_region(
        image
    )

    crop_width, crop_height = (
        cropped_image.size
    )

    print(
        f"Cropped eye region: "
        f"{crop_width} x {crop_height}"
    )


    # ========================================================
    # SAVE CROPPED IMAGE
    # ========================================================

    crop_folder = os.path.join(
        BASE_DIR,
        "real_world_test",
        "cropped"
    )

    os.makedirs(
        crop_folder,
        exist_ok=True
    )

    filename = os.path.basename(
        image_path
    )

    crop_path = os.path.join(
        crop_folder,
        "cropped_" + filename
    )

    try:

        cropped_image.save(
            crop_path
        )

        print(
            "\nCropped image saved at:"
        )

        print(crop_path)

    except Exception as e:

        print(
            "\n⚠️ Could not save cropped image:"
        )

        print(e)


    # ========================================================
    # ORIGINAL IMAGE PREDICTION
    # ========================================================

    original_result = get_prediction(
        image
    )


    # ========================================================
    # CROPPED IMAGE PREDICTION
    # ========================================================

    cropped_result = get_prediction(
        cropped_image
    )


    # ========================================================
    # DISPLAY RESULT
    # ========================================================

    print("\n" + "=" * 65)

    print(
        "       OCULAR ANEMIA SCREENING COMPARISON"
    )

    print("=" * 65)


    # --------------------------------------------------------
    # ORIGINAL
    # --------------------------------------------------------

    print("\nORIGINAL IMAGE")
    print("-" * 65)

    print(
        f"Prediction : "
        f"{original_result[0].upper()}"
    )

    print(
        f"Confidence : "
        f"{original_result[1]:.2f}%"
    )

    print(
        f"Anemia     : "
        f"{original_result[2]:.2f}%"
    )

    print(
        f"No Anemia  : "
        f"{original_result[3]:.2f}%"
    )


    # --------------------------------------------------------
    # CROPPED
    # --------------------------------------------------------

    print("\nCROPPED IMAGE")
    print("-" * 65)

    print(
        f"Prediction : "
        f"{cropped_result[0].upper()}"
    )

    print(
        f"Confidence : "
        f"{cropped_result[1]:.2f}%"
    )

    print(
        f"Anemia     : "
        f"{cropped_result[2]:.2f}%"
    )

    print(
        f"No Anemia  : "
        f"{cropped_result[3]:.2f}%"
    )


    # ========================================================
    # AGREEMENT CHECK
    # ========================================================

    print("\n" + "-" * 65)

    if (
        original_result[0]
        ==
        cropped_result[0]
    ):

        print(
            "✅ ORIGINAL AND CROPPED PREDICTIONS AGREE"
        )

    else:

        print(
            "⚠️ ORIGINAL AND CROPPED PREDICTIONS DISAGREE"
        )

        print(
            "Image composition may be affecting the result."
        )


    # ========================================================
    # SCREENING MESSAGE
    # ========================================================

    print("\n" + "-" * 65)

    print(
        "NOTE:"
    )

    print(
        "This AI output is intended for research/screening"
    )

    print(
        "and should not be treated as a medical diagnosis."
    )

    print(
        "Clinical confirmation requires appropriate medical testing."
    )

    print("=" * 65)


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    if len(sys.argv) < 2:

        print("\nUsage:")

        print(
            'python predict.py ".\\real_world_test\\image24.jpg"'
        )

        sys.exit(1)


    image_path = sys.argv[1]


    # --------------------------------------------------------
    # CHECK FILE EXISTS
    # --------------------------------------------------------

    if not os.path.isfile(image_path):

        print(
            "\n❌ File not found:"
        )

        print(image_path)

        print(
            "\nMake sure you include the image extension."
        )

        print(
            'Example: python predict.py ".\\real_world_test\\image24.jpg"'
        )

        sys.exit(1)


    # --------------------------------------------------------
    # RUN PREDICTION
    # --------------------------------------------------------

    predict_image(
        image_path
    )