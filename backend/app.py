from flask import Flask
from flask_cors import CORS
from routes.clientes import cliente_bp
from routes.proveedores import proveedor_bp
from routes.insumos import insumo_bp
from routes.maquinas import maquina_bp
from routes.tecnicos import tecnico_bp
from routes.mantenimientos import mantenimiento_bp
from routes.cafes import cafe_bp
from routes.auth import auth_bp
from routes.ventas import venta_bp

app = Flask(__name__)
CORS(app)

# Registrar blueprints
app.register_blueprint(cliente_bp)
app.register_blueprint(proveedor_bp)
app.register_blueprint(insumo_bp)
app.register_blueprint(maquina_bp)
app.register_blueprint(tecnico_bp)
app.register_blueprint(mantenimiento_bp)
app.register_blueprint(cafe_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(venta_bp)



@app.route('/')
def home():
    return 'hola mundo flask API Marloy'

if __name__ == '__main__':
    app.run(debug=True)
