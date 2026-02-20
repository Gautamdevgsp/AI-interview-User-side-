import axios from "axios";

const BASE_URL =
  "https://interview.ksesystem.com/";

class APIService {
  studentLogin(data) {
    return axios.post(`${BASE_URL}students/login`, data);
  }

  studentRegister(data) {
    return axios.post(`${BASE_URL}students/register`, data);
  }

  getAssignedInterview(email) {
    return axios.get(
      `${BASE_URL}students/assigned/${encodeURIComponent(email)}`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      },
    );
  }

  getInterviewResult(sessionId) {
    return axios.get(`${BASE_URL}interview/result/${sessionId}`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
  }

  getInterviewQuestions(sessionId) {
    return axios.get(`${BASE_URL}interview/questions/${sessionId}`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
  }

  submitAudioAnswer(sessionId, formData) {
    return axios.post(
      `${BASE_URL}interview/answer-audio/${sessionId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "ngrok-skip-browser-warning": "true",
        },
      },
    );
  }

  startInterview(userEmail, interviewId) {
    return axios.post(
      `${BASE_URL}interview/start`,
      null,
      {
        params: {
          user_email: userEmail,
          interview_id: interviewId,
        },
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
  }
}

export default new APIService();
