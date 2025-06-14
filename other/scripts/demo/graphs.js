var cA = nj.array([[0, -0.44],
                   [2.25, 0]]);
var cB = nj.array([[0.5, -1.94855716],
                   [0.38490018, 0.5]]);

var cyclicGraph = {
    0: {1: cB}, 
    1: {0: cA, 2: cB}, 
    2: {0: cA}}

var cyclicIntervals = [
    new DisconnectedInterval([new Interval(0.15244, 0.65176), 
                              new Interval(2.84228, 2.94228)]),
    new DisconnectedInterval([new Interval(1.48256, 1.71955), 
                              new Interval(2.84228, 2.94228)]),
    new DisconnectedInterval([new Interval(1.48256, 1.71955)]),
]

for(let i = 0; i < cyclicIntervals.length; i++){
    cyclicIntervals[i].color = colors[i]
}

var tA = nj.array([[ 0.923879532511287, -0.217284326304659],
                   [-0.673986071141597, -0.923879532511287]]);
var tB = nj.array([[0.,                1.219308768593441],
                   [0.820136806818482, 0.               ]]);
var tC = nj.array([[0.923879532511287,  0.21728432630466 ],
                   [0.673986071141597, -0.923879532511286]]);

var triangleGraph = {
    0: {2: tA, 1: tC},
    1: {3: tA, 4: tB},
    2: {1: tC},
    3: {0: tB, 5: tC},
    4: {6: tA},
    5: {4: tB},
    6: {7: tC},
    7: {8: tA, 4: tB},
    8: {9: tB},
    9: {2: tA, 10: tC},
    10: {11: tA},
    11: {2: tB, 5: tC}}

var triangleIntervals = [
    new DisconnectedInterval([new Interval(0.65176, 2.07848)]),
    new DisconnectedInterval([new Interval(1.87557, 3.10656)]),
    new DisconnectedInterval([new Interval(0.65176, 1.51132)]),
    new DisconnectedInterval([new Interval(2.77853, 0.88848)]),
    new DisconnectedInterval([new Interval(1.63028, 2.07848)]),
    new DisconnectedInterval([new Interval(2.77853, 3.10656)]),
    new DisconnectedInterval([new Interval(0.65176, 1.26602)]),
    new DisconnectedInterval([new Interval(2.25312, 3.10657)]),
    new DisconnectedInterval([new Interval(2.77853, 0.36306)]),
    new DisconnectedInterval([new Interval(1.06311, 2.07848)]),
    new DisconnectedInterval([new Interval(1.87557, 2.48984)]),
    new DisconnectedInterval([new Interval(0.03503, 0.88848)]),
]

for(let i = 0; i < triangleIntervals.length; i++){
    triangleIntervals[i].color = colors[i]
}

let sa = nj.array([[4.61158179, 0],
                   [0, 0.21684534]]);
let sb = nj.array([[ 3.96798754, -1.55377397],
                   [-1.55377397, 0.86043959]]);
let sc = nj.array([[ 2.41421356, -2.19736823],
                   [-2.19736823, 2.41421356]]);
let sd = nj.array([[ 0.86043959, -1.55377397],
                   [-1.55377397, 3.96798754]]);

let sA = nj.array([[0.21684534, 0],
                   [0, 4.61158179]]);
let sB = nj.array([[0.86043959, 1.55377397],
                   [1.55377397, 3.96798754]]);
let sC = nj.array([[2.41421356, 2.19736823],
                   [2.19736823, 2.41421356]]);
let sD = nj.array([[3.96798754, 1.55377397],
                   [1.55377397, 0.86043959]]);

var surfaceGraph = {
    0: {0: sd, 2: sc, 3: sC, 4: sb, 5: sB, 6: sa, 7: sA},
    1: {1: sD, 2: sc, 3: sC, 4: sb, 5: sB, 6: sa, 7: sA},
    2: {0: sd, 8: sD, 2: sc, 4: sb, 9: sB, 6: sa, 7: sA},
    3: {10: sd, 1: sD, 3: sC, 11: sb, 5: sB, 6: sa, 7: sA},
    4: {0: sd, 1: sD, 2: sc, 12: sC, 4: sb, 6: sa, 13: sA},
    5: {0: sd, 1: sD, 14: sc, 3: sC, 5: sB, 15: sa, 7: sA},
    6: {16: sd, 1: sD, 2: sc, 3: sC, 4: sb, 17: sB, 6: sa},
    7: {0: sd, 18: sD, 2: sc, 3: sC, 19: sb, 5: sB, 7: sA},
    8: {1: sD, 2: sc, 3: sC, 4: sb, 5: sB, 6: sa, 20: sA},
    9: {0: sd, 1: sD, 14: sc, 3: sC, 5: sB, 21: sa, 7: sA},
    10: {0: sd, 2: sc, 3: sC, 4: sb, 5: sB, 22: sa, 7: sA},
    11: {0: sd, 1: sD, 2: sc, 12: sC, 4: sb, 6: sa, 23: sA},
    12: {24: sd, 1: sD, 3: sC, 11: sb, 5: sB, 6: sa, 7: sA},
    13: {0: sd, 25: sD, 2: sc, 3: sC, 19: sb, 5: sB, 7: sA},
    14: {0: sd, 26: sD, 2: sc, 4: sb, 9: sB, 6: sa, 7: sA},
    15: {27: sd, 1: sD, 2: sc, 3: sC, 4: sb, 17: sB, 6: sa},
    16: {0: sd, 2: sc, 28: sC, 4: sb, 5: sB, 6: sa, 7: sA},
    17: {0: sd, 1: sD, 29: sc, 3: sC, 5: sB, 15: sa, 7: sA},
    18: {1: sD, 30: sc, 3: sC, 4: sb, 5: sB, 6: sa, 7: sA},
    19: {2: sd, 1: sD, 2: sc, 31: sC, 4: sb, 6: sa, 13: sA},
    20: {0: sd, 18: sD, 2: sc, 3: sC, 32: sb, 5: sB, 7: sA},
    21: {1: sD, 2: sc, 3: sC, 4: sb, 17: sB, 6: sa},
    22: {16: sd, 1: sD, 2: sc, 3: sC, 4: sb, 33: sB, 6: sa},
    23: {0: sd, 2: sc, 3: sC, 19: sb, 5: sB, 7: sA},
    24: {0: sd, 2: sc, 3: sC, 4: sb, 5: sB, 34: sa, 7: sA},
    25: {1: sD, 3: sC, 4: sb, 5: sB, 6: sa, 7: sA},
    26: {1: sD, 2: sc, 3: sC, 4: sb, 5: sB, 6: sa, 35: sA},
    27: {0: sd, 2: sc, 4: sb, 5: sB, 6: sa, 7: sA},
    28: {10: sd, 1: sD, 3: sC, 5: sB, 6: sa, 7: sA},
    29: {0: sd, 2: sc, 4: sb, 9: sB, 6: sa, 7: sA},
    30: {0: sd, 8: sD, 2: sc, 4: sb, 6: sa, 7: sA},
    31: {1: sD, 3: sC, 11: sb, 5: sB, 6: sa, 7: sA},
    32: {0: sd, 8: sD, 2: sc, 4: sb, 6: sa, 13: sA},
    33: {10: sd, 1: sD, 3: sC, 5: sB, 15: sa, 7: sA},
    34: {16: sd, 1: sD, 2: sc, 12: sC, 4: sb, 6: sa},
    35: {0: sd, 18: sD, 14: sc, 3: sC, 5: sB, 7: sA}
}

var surfaceIntervals = [
    new DisconnectedInterval([new Interval(0.583, 0.202)]),
    new DisconnectedInterval([new Interval(2.154, 1.773)]),
    new DisconnectedInterval([new Interval(1.017, 0.595)]),
    new DisconnectedInterval([new Interval(2.588, 2.166)]),
    new DisconnectedInterval([new Interval(1.409, 0.987)]),
    new DisconnectedInterval([new Interval(2.980, 2.558)]),
    new DisconnectedInterval([new Interval(1.802, 1.339)]),
    new DisconnectedInterval([new Interval(0.231, 2.910)]),
    new DisconnectedInterval([new Interval(2.154, 1.732)]),
    new DisconnectedInterval([new Interval(3.045, 2.558)]),
    new DisconnectedInterval([new Interval(0.583, 0.161)]),
    new DisconnectedInterval([new Interval(1.474, 0.987)]),
    new DisconnectedInterval([new Interval(2.600, 2.125)]),
    new DisconnectedInterval([new Interval(0.296, 2.910)]),
    new DisconnectedInterval([new Interval(1.017, 0.554)]),
    new DisconnectedInterval([new Interval(1.867, 1.339)]),
    new DisconnectedInterval([new Interval(0.689, 0.202)]),
    new DisconnectedInterval([new Interval(2.980, 2.453)]),
    new DisconnectedInterval([new Interval(2.259, 1.773)]),
    new DisconnectedInterval([new Interval(1.409, 0.882)]),
    new DisconnectedInterval([new Interval(0.231, 2.846)]),
    new DisconnectedInterval([new Interval(2.154, 1.339)]),
    new DisconnectedInterval([new Interval(1.802, 1.275)]),
    new DisconnectedInterval([new Interval(0.583, 2.910)]),
    new DisconnectedInterval([new Interval(0.583, 0.097)]),
    new DisconnectedInterval([new Interval(2.547, 1.773)]),
    new DisconnectedInterval([new Interval(2.154, 1.668)]),
    new DisconnectedInterval([new Interval(0.976, 0.202)]),
    new DisconnectedInterval([new Interval(2.940, 2.166)]),
    new DisconnectedInterval([new Interval(1.017, 0.202)]),
    new DisconnectedInterval([new Interval(1.369, 0.595)]),
    new DisconnectedInterval([new Interval(2.588, 1.773)]),
    new DisconnectedInterval([new Interval(1.409, 0.594)]),
    new DisconnectedInterval([new Interval(2.980, 2.166)]),
    new DisconnectedInterval([new Interval(1.802, 0.987)]),
    new DisconnectedInterval([new Interval(0.231, 2.558)]),
]

for(let i = 0; i < surfaceIntervals.length; i++){
    surfaceIntervals[i].color = colors[i]
}