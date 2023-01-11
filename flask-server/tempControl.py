import math
import json
import sys
import logging
from flask import Flask, json, request

app = Flask(__name__)

def simulation(T_target = 293, T_start = 288, T_out = 273, t_i = 1200, t_d = 2, k = 300, t = 7200, t_p = 5, flow = 0.005, penet = 1.7):
    data = {"x" : [], "y" : [], "Target" : [], "Power" : [], "Error" : [], "Loss" : []} 
    # Rozmiar pomieszczenia to 2x2x2[m]
    V = 80 # [m^3] pojemność pomnieszczenia
    S = 20 # [m^2] poweirzchnia scian
    D = 2 # [m] grubość ścian
    c_p = 713 # Ciepło właściwe powietrza
    m_p = V * 1.2

    # ZMIENNE
    # flow  [kg / s] Współczynnik przepływu okna
    # penet [W / (m * K)] Wspołczynnik przenikalności cieplnej ścian 

    # [K]
    T = []
    T.append(T_start)# Temperatura początkowa
    T_max = 400 # Temperatura maksymalna
    T_min = 0 # Temperatura minimalna
    # T_target - Temperatura zadana
    # T_out  Temperatura zewnetrzna

    # ZMIENNE - parametry kontrolera
    # t_i Czas zdwojenia 
    # t_d Czas wyprzedzenia
    # k Wzmocnienie regulatora

    # Parametry grzejnika/chłodziarki
    P = [0.0] # Moc ogrzewania
    P_max = 17500 
    P_min = -1000

    # t_p czas próbkowania [s]
    # t czas trwania symulacji [s]
    N = int(t/t_p) + 1 # liczba kroków symulacji

    e = [1] # Współczynnik uchyb 
    u_max = 20000
    u_min = -100
    u_p = [0.0]
    u_i = [0.0]
    u_d = [0.0]
    u = [0.0]

    loss = [0.0]

    timeVe = [0.0]

    for n in range(1, N):
        e.append(T_target - T[-1])
        
        u_p.append(k * (e[-1] - e[-2]))
        u_i.append(k * (t_p / t_i) * e[-1])
        u_d.append(k * (t_d / t_p) * ((e[-1] - e[-2]) ** 2))
        
        u.append(min(max((u_p[-1] + u_i[-1] + u_d[-1] + u[-1]), u_min), u_max))
        loss.append(((c_p*flow+((penet*S)/D)*(T[-1] - T_out)*t_p)))

        P.append(max(min((u[-1] + P_min), P_max), P_min))
        T.append(max(min(((P[-1] - (c_p*flow+(((penet*S)/D)*(T[-1] - T_out))*t_p))/(m_p*c_p) + T[-1]),T_max), T_min))


        timeVe.append(n * t_p)
        

        data["x"].append(round(timeVe[n] / 60))
        data["y"].append(T[n] - 273)
        data["Target"].append(T_target - 273)
        data["Power"].append(P[-1])
        data["Error"].append(u[n])
        data["Loss"].append(loss[n])

    return data

@app.route("/data", methods=["POST", "GET"])
def starter():
    if request.method == "POST":
        jsonData = request.get_json()
        T_target = jsonData["T_target"]
        T_start = jsonData["T_start"]
        T_out = jsonData["T_out"]
        t_i = jsonData["t_i"]
        t_d = jsonData["t_d"]
        k = jsonData["k"]
        t = jsonData["time"]
        t_p = jsonData["t_p"]
        flow = jsonData["flow"]
        penet = jsonData["penet"]
        return simulation(T_target, T_start, T_out, t_i, t_d, k, t, t_p, flow, penet) 
    else:
        return simulation()
if __name__ == '__main__':
    app.run(debug=True)

