import google.generativeai as genai

genai.configure(api_key="AIzaSyCD6_pwkaEsD8bfMIVtLw5AuFqyfdiAIlU")
model = genai.GenerativeModel("gemini-1.5-flash")
prompt = model.generate_content("Write me a bad funny two sentence horror story about the champion fly swatter guy swatting your face.")

rooms = 20
temperature = 0.2
top_p=0.3
top_k=2
# generation_config = genai.GenerationConfig(
#     temperature=temperature,
#     topP=top_p,
#     topK=top_k
# )

out = open("output/text.txt", "a")
out.write(prompt.text)
out.close()

input = "Create a semicolon-seperated sequence that ends with a semicolon of 10 rooms that would correspond to a text adventure about the following prompt: [timothee chalamet's horror mansion]. Follow this format:Format:room_name:[(comma separated sequence of connected rooms),a number within 1-3 indicating its height relative to sea level and 2=ground floor]; Example:Room1:[(Room2,Room3),2];Room2:[(Room1),1];Room3:[(Room1),3];";

rooms = model.generate_content(input)
print(rooms.text)