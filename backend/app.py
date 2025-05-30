from flask import Flask
from routes.clientes import clientes_bp
from routes.maquinas import maquinas_bp

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Registrar blueprints
app.register_blueprint(clientes_bp)
app.register_blueprint(maquinas_bp)

@app.route('/')
def home():
    return 'hola mundo flask API Marloy'

if __name__ == '__main__':
    app.run(debug=True)
