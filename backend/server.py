from flask import Flask,render_template,request,send_file,make_response
from flask_cors import CORS
from threading import Thread
from werkzeug.utils import secure_filename
import math
import os 
import uuid
from pathlib import Path

UPLOAD_FOLDER = os.path.join("./uploads")
app = Flask(__name__)
cors = CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/<file_name>')
def main(file_name):
  try:
    return send_file(os.path.join("./uploads",file_name))
  except FileNotFoundError:
    return {"Bad Request":"File not found"}


@app.route('/upload', methods=['POST'])
def upload_file():
  try:
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    file = request.files['file']
    extension = file.filename.split(".")[-1]
    filename = secure_filename(f"{str(uuid.uuid4())}.{extension}")
    file.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
    url = f"{request.base_url.split('/upload')[0]}/%s" % filename
    return {"success":True,"url":url}
  except:
      return {"success": False},500


def find(name):
  for root, dirs, files in os.walk('./uploads'):
    if name in files:
      return True
    else:
      return False
    
    
def convert_size(size_bytes):
   if size_bytes == 0:
       return "0B"
   size_name = ("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
   i = int(math.floor(math.log(size_bytes, 1024)))
   p = math.pow(1024, i)
   s = round(size_bytes / p, 2)
   return "%s %s" % (s, size_name[i])

@app.route('/download/<file_name>', methods=['GET'])
def download(file_name):
  result = find(file_name)
  if result:  
    file_size= Path(f'./uploads/{file_name}').stat().st_size
    response = {
      "name": file_name,
      "size": convert_size(file_size)
    }
    return response
  else: 
    return {"Bad Request": "File Not Found"}, 500
  

app.run(debug=True)
