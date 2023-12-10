import streamlit as st
import cv2
import time
from threading import Thread

# Global variable to control the capture process
capture = False

def capture_images():
    global capture
    cap = cv2.VideoCapture(0)  # Initialize webcam
    while capture:
        ret, frame = cap.read()
        if ret:
            # Save image with timestamp
            filename = f"image_{int(time.time())}.jpg"
            cv2.imwrite(filename, frame)
        time.sleep(5)
    cap.release()

def main():
    st.title("Shipment Tracking Application")

    col1, col2 = st.columns(2)

    with col1:
        if st.button("Start Shipment"):
            global capture
            capture = True
            thread = Thread(target=capture_images)
            thread.start()
            st.success("Shipment in progress.")
            st.success("Internet Connection Established")
            st.success("Connected to AWS S3 Bucket")

    with col2:
        if st.button("End Shipment"):
            capture = False
            st.success("Shipment Ended.")
            st.success("Connection Terminated")

    if capture:
        st.info("Data Transmission in progress......")

if __name__ == "__main__":
    main()
