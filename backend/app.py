from flask import Flask
from routes.clientes import cliente_bp
from routes.maquinas import maquinas_bp
from routes.auth import auth_bp
from routes.insumos import insumos_bp
from routes.proveedores import proveedores_bp
from routes.tecnicos import tecnicos_bp
from routes.mantenimientos import mantenimientos_bp
from routes.reportes import reportes_bp

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Registrar blueprints
app.register_blueprint(cliente_bp)
app.register_blueprint(maquinas_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(insumos_bp)
app.register_blueprint(proveedores_bp)
app.register_blueprint(tecnicos_bp)
app.register_blueprint(mantenimientos_bp)
app.register_blueprint(reportes_bp)


@app.route('/')
def home():
    return 'hola mundo flask API Marloy'

if __name__ == '__main__':
    app.run(debug=True)
