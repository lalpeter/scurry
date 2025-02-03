print("hello world!")

import google.generativeai as genai

genai.configure(api_key="AIzaSyCD6_pwkaEsD8bfMIVtLw5AuFqyfdiAIlU")
model = genai.GenerativeModel("gemini-1.5-flash")
prompt = model.generate_content("Write me a bad funny two sentence horror story about the champion fly swatter guy swatting your face.")

print(prompt.text)

rooms = 20
temperature = 0.2
top_p=0.3
top_k=2
generation_config = genai.GenerationConfig(
    temperature=temperature,
    topP=top_p,
    topK=top_k
)

out = open("output/text.txt", "a")
out.write(prompt.text)
out.close()


rooms = model.generate_content(f"Create a comma-seperated sequence of {rooms} rooms that would correspond to a text adventure about the following prompt: [{prompt}]. Follow this format:
Format:
room_name:(comma separated sequence of connected rooms)
Example:
Room1:(Room2,Room3),Room2:(Room1), Room3:(Room1)")