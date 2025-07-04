from flask import Flask
<<<<<<< HEAD
from routes.clientes import cliente_bp
from routes.maquinas import maquinas_bp
from routes.auth import auth_bp
from routes.insumos import insumos_bp
from routes.proveedores import proveedores_bp
from routes.tecnicos import tecnicos_bp
from routes.mantenimientos import mantenimientos_bp
from routes.reportes import reportes_bp

from flask import Flask
=======
>>>>>>> 64dfde0d9fee8ff8bf5f84b23071d91a6e57b09f
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
<<<<<<< HEAD
app.register_blueprint(maquinas_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(insumos_bp)
app.register_blueprint(proveedores_bp)
app.register_blueprint(tecnicos_bp)
app.register_blueprint(mantenimientos_bp)
app.register_blueprint(reportes_bp)
=======
app.register_blueprint(proveedor_bp)
app.register_blueprint(insumo_bp)
app.register_blueprint(maquina_bp)
app.register_blueprint(tecnico_bp)
app.register_blueprint(mantenimiento_bp)
app.register_blueprint(cafe_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(venta_bp)


>>>>>>> 64dfde0d9fee8ff8bf5f84b23071d91a6e57b09f

@app.route('/')
def home():
    return 'hola mundo flask API Marloy'

if __name__ == '__main__':
    app.run(debug=True)
