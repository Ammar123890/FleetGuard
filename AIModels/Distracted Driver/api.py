from fastapi import FastAPI, File, UploadFile
from predictionOnImage import return_prediction
from PIL import Image
import io

app = FastAPI()

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    prediction = return_prediction(image)
    return {"prediction": prediction}
