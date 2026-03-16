const BASE_URL = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8080';

let token: string | null = null;

export function setToken(t: string) {
  token = t;
  if (t) localStorage.setItem('token', t);
  else localStorage.removeItem('token');
}

export function getToken() {
  if (!token) token = localStorage.getItem('token');
  return token;
}

function authHeaders(): HeadersInit {
  const t = getToken();
  if (t) {
    return { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' };
  }
  return { 'Content-Type': 'application/json' };
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return res.json();
}

// ============ AUTHENTICATION ============
export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await handleResponse(res);
  setToken(data.token);
  return data;
}

export async function logout() {
  const t = getToken();
  if (t) {
    await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${t}` }
    });
  }
  setToken('');
}

export async function registerStudent(data: any) {
  const res = await fetch(`${BASE_URL}/api/auth/register/student`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function registerAdmin(data: any) {
  const res = await fetch(`${BASE_URL}/api/auth/register/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

// ============ BOOKS ============
export async function getBooks(page = 0, size = 10) {
  const res = await fetch(`${BASE_URL}/api/books?page=${page}&size=${size}`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function getBook(id: string) {
  const res = await fetch(`${BASE_URL}/api/books/${id}`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function searchBooks(query: string, page = 0, size = 10) {
  const res = await fetch(`${BASE_URL}/api/books/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function browseBooks(params: { department?: string; subject?: string; status?: string; availableOnly?: boolean; page?: number; size?: number } = {}) {
  const url = new URL(`${BASE_URL}/api/books/browse`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  });
  const res = await fetch(url.toString(), { headers: authHeaders() });
  return handleResponse(res);
}

export async function addBook(bookData: any) {
  const res = await fetch(`${BASE_URL}/api/books`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(bookData)
  });
  return handleResponse(res);
}

export async function updateBook(id: string, bookData: any) {
  const res = await fetch(`${BASE_URL}/api/books/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(bookData)
  });
  return handleResponse(res);
}

export async function deleteBook(id: string) {
  const res = await fetch(`${BASE_URL}/api/books/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete book');
}

// ============ USERS ============
export async function getUsers(page = 0, size = 10) {
  const res = await fetch(`${BASE_URL}/api/users?page=${page}&size=${size}`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function getUser(id: string) {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function updateUser(id: string, userData: any) {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(userData)
  });
  return handleResponse(res);
}

export async function deleteUser(id: string) {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete user');
}

export async function suspendUser(id: string, reason?: string) {
  const url = reason ? `${BASE_URL}/api/users/${id}/suspend?reason=${encodeURIComponent(reason)}` : `${BASE_URL}/api/users/${id}/suspend`;
  const res = await fetch(url, {
    method: 'POST',
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function activateUser(id: string) {
  const res = await fetch(`${BASE_URL}/api/users/${id}/activate`, {
    method: 'POST',
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function searchUsers(query: string, page = 0, size = 10) {
  const res = await fetch(`${BASE_URL}/api/users/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function filterUsers(filters: any, page = 0, size = 10) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  Object.entries(filters).forEach(([k, v]) => {
    if (v) params.set(k, String(v));
  });
  const res = await fetch(`${BASE_URL}/api/users/filter?${params}`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

// ============ ISSUES ============
export async function issueBook(userId: string, bookId: string, issuedBy: string) {
  const res = await fetch(`${BASE_URL}/api/issues?userId=${userId}&bookId=${bookId}&issuedBy=${issuedBy}`, {
    method: 'POST',
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function returnBook(issueId: string, returnedTo: string) {
  const res = await fetch(`${BASE_URL}/api/issues/${issueId}/return?returnedTo=${returnedTo}`, {
    method: 'PUT',
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function renewBook(issueId: string) {
  const res = await fetch(`${BASE_URL}/api/issues/${issueId}/renew`, {
    method: 'PUT',
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function getUserIssues(userId: string, page = 0, size = 10) {
  const res = await fetch(`${BASE_URL}/api/issues/user/${userId}?page=${page}&size=${size}`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

// ============ FINES ============
export async function getFines(page = 0, size = 10) {
  const res = await fetch(`${BASE_URL}/api/fines?page=${page}&size=${size}`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function getUserFines(userId: string, page = 0, size = 10) {
  const res = await fetch(`${BASE_URL}/api/fines/user/${userId}?page=${page}&size=${size}`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function payFine(fineId: string) {
  const res = await fetch(`${BASE_URL}/api/fines/${fineId}/pay`, {
    method: 'POST',
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function waiveFine(fineId: string) {
  const res = await fetch(`${BASE_URL}/api/fines/${fineId}/waive`, {
    method: 'PUT',
    headers: authHeaders()
  });
  return handleResponse(res);
}

// ============ STATISTICS ============
export async function getAdminStats() {
  const res = await fetch(`${BASE_URL}/api/stats/admin`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function getLibrarianStats() {
  const res = await fetch(`${BASE_URL}/api/stats/librarian`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function getUserStats(userId: string) {
  const res = await fetch(`${BASE_URL}/api/stats/user/${userId}`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

// ============ BOOK REQUESTS ============
export async function createBookRequest(userId: string, bookId: string, notes?: string) {
  const res = await fetch(`${BASE_URL}/api/book-requests`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ userId, bookId, notes })
  });
  return handleResponse(res);
}

export async function getBookRequests(page = 0, size = 10) {
  const res = await fetch(`${BASE_URL}/api/book-requests?page=${page}&size=${size}`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function getPendingBookRequests() {
  const res = await fetch(`${BASE_URL}/api/book-requests/pending`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function getUserBookRequests(userId: string, page = 0, size = 10) {
  const res = await fetch(`${BASE_URL}/api/book-requests/user/${userId}?page=${page}&size=${size}`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function approveBookRequest(requestId: string, processedBy: string) {
  const res = await fetch(`${BASE_URL}/api/book-requests/${requestId}/approve?processedBy=${processedBy}`, {
    method: 'PUT',
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function rejectBookRequest(requestId: string, processedBy: string, reason?: string) {
  const url = reason
    ? `${BASE_URL}/api/book-requests/${requestId}/reject?processedBy=${processedBy}&reason=${encodeURIComponent(reason)}`
    : `${BASE_URL}/api/book-requests/${requestId}/reject?processedBy=${processedBy}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: authHeaders()
  });
  return handleResponse(res);
}

// ============ NOTIFICATIONS ============
export async function getUserNotifications(userId: string, page = 0, size = 10) {
  const res = await fetch(`${BASE_URL}/api/notifications/user/${userId}?page=${page}&size=${size}`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function getUnreadNotificationCount(userId: string) {
  const res = await fetch(`${BASE_URL}/api/notifications/unread/${userId}`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function markNotificationAsRead(notificationId: string) {
  const res = await fetch(`${BASE_URL}/api/notifications/${notificationId}/read`, {
    method: 'PUT',
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function markAllNotificationsAsRead(userId: string) {
  const res = await fetch(`${BASE_URL}/api/notifications/read-all/${userId}`, {
    method: 'PUT',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to mark notifications as read');
}

export async function deleteNotification(notificationId: string) {
  const res = await fetch(`${BASE_URL}/api/notifications/${notificationId}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete notification');
}

export async function sendNotification(userId: string, title: string, message: string, type = 'INFO') {
  const res = await fetch(`${BASE_URL}/api/notifications/send`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ userId, title, message, type })
  });
  return handleResponse(res);
}

export async function broadcastNotification(title: string, message: string, type = 'INFO') {
  const res = await fetch(`${BASE_URL}/api/notifications/broadcast`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ title, message, type })
  });
  if (!res.ok) throw new Error('Failed to broadcast notification');
}

// ============ ANALYTICS ============
export async function getDashboardAnalytics() {
  const res = await fetch(`${BASE_URL}/api/analytics/dashboard`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function getPopularBooks() {
  const res = await fetch(`${BASE_URL}/api/analytics/books/popular`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

// ============ RESERVATIONS ============
export async function createReservation(userId: string, bookId: string) {
  const res = await fetch(`${BASE_URL}/api/reservations`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ userId, bookId })
  });
  return handleResponse(res);
}

export async function getUserReservations(userId: string, page = 0, size = 10) {
  const res = await fetch(`${BASE_URL}/api/reservations/user/${userId}?page=${page}&size=${size}`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function getBookReservations(bookId: string) {
  const res = await fetch(`${BASE_URL}/api/reservations/book/${bookId}`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function cancelReservation(reservationId: string) {
  const res = await fetch(`${BASE_URL}/api/reservations/${reservationId}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to cancel reservation');
}

// ============ PROFILE ============
export async function getCurrentProfile() {
  const res = await fetch(`${BASE_URL}/api/profile`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function updateProfile(profileData: any) {
  const res = await fetch(`${BASE_URL}/api/profile`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(profileData)
  });
  return handleResponse(res);
}

export async function changePassword(oldPassword: string, newPassword: string) {
  const res = await fetch(`${BASE_URL}/api/profile/password`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ oldPassword, newPassword })
  });
  return handleResponse(res);
}
