# -*- coding: utf-8 -*-
import BaseHTTPServer
import SimpleHTTPServer
import pyjade
import os
import json
import sys


class RequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):

    def get_jade_context(self):
        with open('./jade-dev.context') as f:
            return json.load(f)

    def render_jade(self, orig_path):
        jade_template_path = "%s.jade" % os.path.splitext(orig_path)[0]
        with open(jade_template_path) as f:
            src = f.read()
        parser = pyjade.parser.Parser(src)
        block = parser.parse()
        compiler = pyjade.ext.html.Compiler(block, pretty=True)
        compiler.global_context = self.get_jade_context()
        try:
            html = compiler.compile()
            with open(orig_path, 'w') as f:
                f.write(html)
        except:
            os.system('jade ' + jade_template_path + ' --out ' +
                      os.path.dirname(orig_path) + ' --obj ./jade-dev.context')
        return orig_path


    def translate_path(self, path):
        ext = os.path.splitext(path)[-1]

        if ext.lower() == '.html':
            path = self.render_jade('.'+path)
        elif path == '/':
            path = self.render_jade('./views/index.html')
        elif not ext and '--as-angular-app' in sys.argv:
            path = self.render_jade('./views/index.html')
        elif not ext:
            path = './views' + path + '.html'
            path = self.render_jade(path)

        return SimpleHTTPServer.SimpleHTTPRequestHandler.translate_path(self, path)


port = os.environ.get('PORT', 8000)
server_address = ("", int(port))
httpd = BaseHTTPServer.HTTPServer(server_address, RequestHandler)
httpd.serve_forever()
