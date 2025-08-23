import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const authService = {
    async login(username, password) {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                username,
                password
            })

            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || "Login Failed.")
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole')
    },

    getToken() {
        return localStorage.getItem('token')
    },

    getUserRole() {
        return localStorage.getItem('userRole')
    },

    getUserName() {
        return localStorage.getItem('userName')
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    setAuthData(token, role, name) {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', name);
  }
}

export default authService;