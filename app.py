from flask import Flask, render_template, redirect, request, send_file
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import and_
from flask_login import LoginManager, login_required, login_user, logout_user

import csv

db = SQLAlchemy()
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite3"
app.secret_key = 'fejifjfjfjdlskfjldsfemfdjkop'
db.init_app(app)
login_manager = LoginManager(app)


@login_manager.user_loader
def load_user(user_id):
    print("load_user")
    return UserLogin().fromDB(user_id)


class UserLogin:

    def getUser(self, user_id):
        user = User.query.filter_by(id=user_id).first()
        return user

    def fromDB(self, user_id, ):
        self.__user = User.query.filter_by(id=user_id).first()
        return self

    def create(self, user):
        print("im hire ", user)
        self.__user = user
        return self

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        print("get id ", self.__user.id)
        return str(self.__user.id)


class User(db.Model):
    id = db.Column('id', db.Integer, primary_key=True)
    login_name = db.Column(db.String(100))
    password = db.Column(db.String(100))

    def __init__(self, login_name, password, id):
        self.id = id
        self.login_name = login_name
        self.password = password


class Clients(db.Model):
    id = db.Column('id', db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    work = db.relationship('Works', back_populates="client")

    def __init__(self, name, client_id):
        self.name = name
        self.id = client_id


class Employers(db.Model):
    id = db.Column('id', db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    work = db.relationship('Works', back_populates="employer")

    def __init__(self, name, employer_id):
        self.id = employer_id
        self.name = name


class Works(db.Model):
    work_id = db.Column('work_id', db.Integer, db.Sequence('seq_reg_id', start=1, increment=1), primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'))
    client = db.relationship('Clients', back_populates="work")
    employer_id = db.Column(db.Integer, db.ForeignKey("employers.id"))
    employer = db.relationship('Employers', back_populates="work")
    period = db.Column(db.String(10))
    date = db.Column(db.String(100))
    start = db.Column(db.String(100))
    end = db.Column(db.String(100))
    time = db.Column(db.Float)

    def __init__(self, client_id, employer_id, date, time, period, start, end):
        self.client_id = client_id
        self.employer_id = employer_id
        self.date = date
        self.time = time
        self.period = period
        self.start = start
        self.end = end


with app.app_context():
    db.create_all()


# Home Page
@app.route("/", methods=['POST', 'GET'])
@app.route("/home", methods=['POST', 'GET'])
@login_required
def index():
    if request.method == 'POST':
        form = request.form
        print("IM HIRE")
        print(form.getlist('day_of_work'))
        for i in range(len(form.getlist('day_of_work'))):

            print(form.getlist('start_of_work')[i][11:])

            if_client_exists = db.session.query(
                db.exists().where(Clients.id == form.getlist('clients_id')[i])).scalar()
            if_employer_exists = db.session.query(
                db.exists().where(Employers.id == form.getlist('employer_id')[i])).scalar()

            if not if_employer_exists:
                employer = Employers(employer_id=form.getlist('employer_id')[i],
                                     name=form.getlist('employer_name')[i])
                db.session.add(employer)
                db.session.commit()

            if not if_client_exists:
                client = Clients(client_id=form.getlist('clients_id')[i],
                                 name=form.getlist('clients_name')[i])
                db.session.add(client)
                db.session.commit()

            day_of_work = form.getlist('day_of_work')[i]
            time = float(form.getlist('time_of_work')[i].replace(',', '.'))
            if_work_exists = db.session.query(
                db.session.query(Works).filter_by(
                    employer_id=form.getlist('employer_id')[i],
                    client_id=form.getlist('clients_id')[i],
                    date=form.getlist('day_of_work')[i],
                    time=float(form.getlist('time_of_work')[i].replace(',', '.')),
                    start=form.getlist('start_of_work')[i][11:],
                    end=form.getlist('end_of_work')[i][11:],
                ).exists()).scalar()
            print(if_work_exists)
            if not if_work_exists:
                work = Works(employer_id=form.getlist('employer_id')[i],
                             client_id=form.getlist('clients_id')[i],
                             date=day_of_work,
                             period=day_of_work[:-3],
                             start=form.getlist('start_of_work')[i][11:],
                             end=form.getlist('end_of_work')[i][11:],
                             time=time)
                db.session.add(work)
                db.session.commit()
        return redirect("/archive")
    return render_template("index.html")


@app.route("/archive", methods=['POST', 'GET'])
@login_required
def archive():
    result = {"period": [],
              "clients": [],
              "employers": [],
              }
    works = Works.query.all()
    period_to = ""
    for work in works:
        if period_to != work.date[:-3]:
            period_to = work.date[:-3]
            result["period"].append(period_to)
        if work.client not in result["clients"]:
            result["clients"].append(work.client)

        if work.employer not in result["employers"]:
            result["employers"].append(work.employer)

    # result["index"] = (max(len(result["period"]),
    #                        len(result["clients"]),
    #                        len(result["employers"])
    #                        ))
    result["index"] = len(result["period"])
    return render_template("archive.html", result=result)


@app.route("/period", methods=['POST', 'GET'])
@login_required
def period():
    result = {"clients": [],
              "period": "",
              "employers": [],
              "works": [],
              "time": ""}
    res_list = make_list_with_employers_time()
    if request.method == 'GET':
        result["period"] = request.values["period"]
        if "client_id" not in request.values and "employer_id" not in request.values:
            works = Works.query.filter_by(period=result["period"])
            for work in works:
                client = {
                    "client_id": str(work.client.id),
                    "client_name": work.client.name
                }
                result["clients"].append(client)
            print(result["clients"][0].items())
            for i in range(len(result["clients"])):
                if result["clients"][i] not in result["clients"][i + 1:]:
                    res_list.append(result["clients"][i])
            result["clients"] = res_list
        elif "client_id" in request.values and "period" in request.values and "employer_id" not in request.values:
            works = get_works()
            result["clients"].append(works[0].client)
            result["period"] = request.values["period"]
            employers = make_list_with_employers_time()
            employers_tmp_id = make_list_with_employers_time()
            employers_tmp = make_list_with_employers_time()
            extract_employers_from_works(employers, works)
            for employer in employers:
                if not employer["employer_id"] in employers_tmp_id:
                    employers_tmp_id.append(employer["employer_id"])
                    employers_tmp.append(employer)
                else:
                    for i in range(len(employers_tmp)):
                        if employers_tmp[i]["employer_id"] == employer["employer_id"]:
                            employers_tmp[i]["time"] = employers_tmp[i]["time"] + employer["time"]
            result["employers"] = employers_tmp
            return render_template("employers_list.html", result=result)
        elif "client_id" in request.values and "period" in request.values and "employer_id" in request.values:
            print(request.values)
            works = db.session.query(Works).filter(
                and_(
                    Works.period.like(request.values["period"]),
                    Works.client_id.like(request.values["client_id"]),
                    Works.employer_id.like(request.values["employer_id"])
                )
            )
            print(works)
            time_tmp = 0
            for work in works:
                time_tmp = time_tmp + work.time
                result["works"].append(work)
            result["time"] = time_tmp
            return render_template("works_list.html", result=result)

    return render_template("clients_list.html", result=result)


def extract_employers_from_works(employers, works):
    for work in works:
        employers.append({
            "employer_id": work.employer.id,
            "employer_name": work.employer.name,
            "time": work.time
        })


def make_list_with_employers_time():
    employers = []
    return employers


def get_works():
    works = db.session.query(Works).filter(
        and_(
            Works.period.like(request.values["period"]),
            Works.client_id.like(request.values["client_id"])
        )
    )
    return works


@app.route("/csv", methods=['POST', 'GET'])
@login_required
def create_csv():
    result = {"clients": [],
              "period": "",
              "employers": [],
              "works": [],
              "time": ""}
    if request.method == 'GET':
        if "client_id" in request.values and "period" in request.values:
            print(request.values)
            works = db.session.query(Works).filter(
                and_(
                    Works.period.like(request.values["period"]),
                    Works.client_id.like(request.values["client_id"])
                )
            )
            result["clients"].append(works[0].client)
            result["period"] = request.values["period"]
            employers = []
            employers_tmp_id = []
            employers_tmp = []
            extract_employers_from_works(employers, works)
            for employer in employers:
                if not employer["employer_id"] in employers_tmp_id:
                    employers_tmp_id.append(employer["employer_id"])
                    employers_tmp.append(employer)
                else:
                    for i in range(len(employers_tmp)):
                        if employers_tmp[i]["employer_id"] == employer["employer_id"]:
                            employers_tmp[i]["time"] = employers_tmp[i]["time"] + employer["time"]
            result["static/uploads/test"] = employers_tmp
            path = f"""static/uploads/{works[0].client.name}_{works[0].period}.cvs"""
            file = open(path, "w")
            writer = csv.writer(file, delimiter=';')
            for employer in employers_tmp:
                print(employer)
                data = [works[0].client.name,
                        works[0].client.id,
                        employer["employer_name"],
                        employer["employer_id"],
                        works[0].period,
                        works[0].time]
                writer.writerow(data)
            file.close()
            print(request.values)
            return send_file(path, as_attachment=True)


@app.route("/remove", methods=['POST', 'GET'])
@login_required
def remove_from_db():
    if request.method == 'GET':
        works = db.session.query(Works).filter(
            and_(
                Works.period.like(request.values["period"])
            )
        )
        works.delete(synchronize_session='fetch')
        db.session.commit()
    return redirect("/archive")


@app.errorhandler(401)
def custom_401(error):
    return redirect('/login')


@app.route("/login", methods=['POST', 'GET'])
def login():
    # if current_user.is_authenticated:
    #     return redirect('/')

    if request.method == "POST":
        print(request.form["login"])
        print(request.form["password"])
        user = User.query.filter_by(login_name=request.form["login"]).first()
        print(user)
        if user != None:
            if user.password == request.form['password']:
                print(user.login_name, " are now in ")
                print(user)
                user_login = UserLogin().create(user)
                login_user(user_login)
                return redirect('/')
        return redirect('/login')

    return render_template("login.html")


@app.route("/logout")
def logout():
    logout_user()
    return redirect("/login")


if __name__ == '__main__':
    app.run(debug=True, host="127.0.0.1")
