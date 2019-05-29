from flask import Flask, render_template, request, redirect, url_for, session, flash
from db import *
from utils import ebay
import urllib
import requests
import os
import glob
app = Flask(__name__)
app.secret_key = os.urandom(32)

ret = {}
money = 0.0

@app.route('/')
def root():
	if in_session():
		return redirect( url_for('home') )
	else:
		return render_template("welcome.html")


@app.route('/home',methods=['GET','POST'])
def home():
	if in_session(): # INFO to be passed: list of top 10 highcores
        	score = -1
		global money
		money = getcash(session['username'])
		if ('score' in request.form):
			score = request.form['score']
			addscore(session['username'], int(score))
		scorelist = gethighscore()
		return render_template("home.html", me = score, cash = money, scores = scorelist)
	else:
		# make sure scores are in order from highest to lowest in the list
		return render_template('welcome.html')


@app.route('/login', methods=['GET','POST'])
def login():
	if in_session():
		return redirect( url_for('home') )
	else:
		return render_template("login.html")

@app.route('/login_auth', methods=['POST'])
def login_auth():
    usr = request.form['usr']
    pwd = request.form['pwd']
    if usr != '':
        if match(usr,pwd):
            login_db(usr,pwd)
            return redirect( url_for('login') )
        return render_template('login.html', condition='1')
    else:
        return render_template('login.html', condition='1')

@app.route('/register_auth', methods=["POST"])
def register_auth():
        usr = request.form['usr']
        pwd = request.form['pwd']
        if get_pass(usr) is None:
                cfm = request.form['cfm']
                if pwd == cfm:
                        adduser(usr,pwd)
                        login_db(usr,pwd)
                        return redirect( url_for('login') )
                else:
                        return render_template("register.html", condition='1')

        else:
                return render_template("register.html", condition='2')

@app.route('/register')
def register():
	if in_session():
		return redirect( url_for('home') )
	else:
		return render_template("register.html")


@app.route('/store', methods=['POST','GET'])
def store():
	if in_session():
		# INFO to be passed: search result from the query
		# method=POST: if item purchased then subtract price of item from the amount of money the user has and refresh?
		# method=GET: search query? you can rearrange if you want
		return render_template("store.html", condition='0', cash=money)
	else:
		return redirect( url_for('root') )

@app.route('/search', methods=['POST', 'GET'])
def search():
        search = request.form['keyword']
        global ret
        ret = ebay.search(search)
        return render_template('store.html', cash = money, condition='1', ret=ret)

@app.route('/buy', methods=['POST','GET'])
def buy():
        name = session['username']
        money = getcash(name)
        print "this is the money of user at buy"
        print money
        if money > ret['price']:
                if isunique(name,ret['title'] + ".png") == False:
                        cond = 0
                        files = glob.glob("static/images/*.png")
                        file_name = "static/images/" + ret['title'] + ".png"
                        for thing in files:
                                if files == thing:
                                        cond = 1
                        if cond == 0:
                                os.system("touch " + file_name)
                                f = open(file_name, 'wb')
                                f.write(urllib.urlopen(ret['image']).read())
                                f.close()
                        additem(name,ret['title'] + ".png")
                        money = money - ret['price']
                        changevalue(money, name)
                        return render_template("store.html", cash=money, condition='0')
                else:
                        return render_template("store.html", cash=money, condition='3')
        else:
            return render_template("store.html", cash=money, condition='2')


@app.route('/profile', methods=['GET','POST'])
def profile():
	if in_session():
		# INFO to be passed: items already bought by user and whether or not
		# user has chosen to use it in gameplay (0 means not chosen, 1 means chosen)
                items = {}
                usr = session['username']
                useitem = itemusinglist(usr)
                for item in itemlist(usr):
                        if item in useitem:
                                items[item] = 1
                        else:
                                items[item] = 0
                return render_template("profile.html", cash=money, items = items)
	else:
		return redirect( url_for('root') )

@app.route('/equip', methods=['POST', 'GET'])
def equip():
        name = session['username']
        items = {}
        useitem = itemusinglist(name)
        for thing in itemlist(name):
                if thing in useitem:
                        items[thing] = 1
                else:
                        items[thing] = 0
        if 'unequip' in request.form:
                item = request.form['unequip']
                if isnotmax(useitem):
                        use(name,item)
                else:
                        return render_template("profile.html", cash=getcash(session['username']), items=items, condition='1')
        else:
                item = request.form['equip']
                if len(useitem) > 1:
                        notuse(name,item)
                else:
                        return render_template("profile.html", cash=getcash(session['username']), items=items, condition='2')
        return redirect( url_for('profile') )

@app.route('/logout')
def logout():
        logout_db()
        return render_template("welcome.html")


@app.route('/play',methods=['POST','GET'])
def play():
	if in_session():
		return render_template("play.html")
	else:
		return redirect( url_for('root') )


if __name__ == '__main__':
    app.debug = True
    app.run()
