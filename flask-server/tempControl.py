from math import sqrt
from flask import Flask, json

app = Flask(__name__)
@app.route('/data')

def simulation():
    # Rozmiar pomieszczenia to 2x2x2[m]
    V = 8 # [m^3] pojemność pomnieszczenia
    S = 20 # [m^2] poweirzchnia scian
    D = 0.3 # [m grubość ścian
    c_p = 713 # Ciepło właściwe powietrza
    m_p = V * 1.2

    # ZMIENNE
    flow = 0.005 # [kg / s] Współczynnik przepływu okna
    penet = 1.7 # [W / (m * K)] Wspołczynnik przenikalności cieplnej ścian 

    # [K]
    T = [288] # Temperatura początkowa
    T_max = 3000 # Temperatura maksymalna
    T_min = -100 # Temperatura minimalna
    T_target = 303 # Temperatura zadana
    T_out = 273 # Temperatura zewnetrzna

    # ZMIENNE - parametry kontrolera
    t_i = 800 # Czas zdwojenia 
    t_d = 7
    k = 0.8 # Wzmocnienie regulatora

    # Parametry grzejnika/chłodziarki
    P = [0.0] # Moc ogrzewania
    P_max = 175.0 
    P_min = 115

    t_p = 30 # czas próbkowania [s]
    t = 3600 # czas trwania symulacji [s]
    N = int(t/t_p) + 1 # liczba kroków symulacji

    e = [1] # Współczynnik uchyb 
    u_max = 2000
    u_min = 0.0
    u_p = [0.0]
    u_i = [0.0]
    u_d = [0.0]
    u = [0.0]

    timeVe = [0.0]


    data = {"x" : [], "y" : []}


    for n in range(1, N):
        e.append(T_target - T[-1])
        
        u_p.append(k * (e[-1] - e[-2]))
        u_i.append(k * (t_p / t_i) * e[-1])
        u_d.append(k * (t_d / t_p) * ((e[-1] - e[-2]) ** 2))
        
        u.append(min(u_p[-1] + u_i[-1] + u_d[-1] + u[-1], u_max))

        P.append(max(min((u[-1] + P_min), P_max), P_min))
        T.append(max(min(((P[-1] - (c_p * flow + (penet * S) / D)) * (T[-1] - T_out) * t_p)/(m_p * c_p) + T[-1], T_max), T_min))

        timeVe.append(n * t_p)
        

        data["x"].append(timeVe[n])
        data["y"].append(T[n])

    return data
"""
def jsonise():
    data = simulation()
    response = app.response_class(
        response=json.dumps(data),
        mimetype='application/json'
    )
    return response
"""
if __name__ == '__main__':
    app.run(debug=True)

