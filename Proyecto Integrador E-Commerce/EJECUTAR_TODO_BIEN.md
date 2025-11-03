# Ejecutar proyecto (Windows) — venv en la raíz + MySQL
1) Activar entorno (en la raíz):
   .\venv\Scripts\activate
2) Backend:
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver 127.0.0.1:8000
3) Frontend (otra terminal):
   cd frontend
   npm install
   npm run dev
4) Probar: /login, /courses, /cart
