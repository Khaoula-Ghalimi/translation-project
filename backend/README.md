# 🔧 Translation App — Backend (Java JEE)

This is the **Java JEE backend** of the AI-powered Translation App.  
It integrates with **Google Gemini** to provide:

- Translation
- Suggested language detection
- Meanings extraction
- Alternative translations
- Text-to-Speech (PCM → WAV)


## 🏗️ Architecture (Backend Side)

- REST API using Java JEE Servlets
- Gemini Java client
- Schema-based response validation
- Custom CORS filter
- Audio generation (.pcm converted to .wav)


## 🔌 Endpoints

### **GET `/api/isup`**
Health check — validates Gemini API key by sending `"PING"` to Gemini.

### **GET `/api/translate`**
- For short texts (max **20 words**)  
- Query params: `text`, `sourceLang`, `targetLang`

### **POST `/api/translate`**
- Accepts longer text  
- Body:

```json
{
  "text": "...",
  "sourceLang": "English",
  "targetLang": "French"
}
```

### 🛠️ Requirements

- Java 17+

- Apache Maven

- WildFly 37

- Valid Google Gemini API key

- Internet access

## Backend Setup (Java JEE)
### 1. Import project to eclipse (didn't test with intellij)
### 2. Go to the backend folder
### 3. Inside /src/main create a folder called **resources**
### 4. Create the **.env** file inside that folder then add
```env
API_KEY=your_gemini_key
```
### 5. Add project to Wildfly in eclipse then build and run