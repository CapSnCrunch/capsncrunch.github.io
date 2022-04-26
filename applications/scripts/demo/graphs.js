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
    new DisconnectedInterval([new Interval(1.48256, 1.63955), 
                              new Interval(2.84228, 2.94228)]),
    new DisconnectedInterval([new Interval(1.48256, 1.63955)]),
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

let sa = 0;
let sb = 0;
let sc = 0;
let sd = 0;

let sA = 0;
let sB = 0;
let sC = 0;
let sD = 0;

var surfaceGraph = {
    0: {1: sd, 2: sD, 3: sc, 4: sC, 5: sb, 6: sB, 7: sa, 8: sA},
    1: {1: sd, 3: sc, 4: sC, 5: sb, 6: sB, 7: sa, 8: sA},
    2: {2: sD, 3: sc, 4: sC, 5: sb, 6: sB, 7: sa, 8: sA},
    3: {1: sd, 9: sD, 3: sc, 5: sb, 10: sB, 7: sa, 8: sA},
    4: {11: sd, 2: sD, 4: sC, 12: sb, 6: sB, 7: sa, 8: sA},
    5: {1: sd, 2: sD, 3: sc, 13: sC, 5: sb, 7: sa, 14: sA},
    6: {1: sd, 2: sD, 15: sc, 4: sC, 6: sB, 16: sa, 8: sA},
    7: {17: sd, 2: sD, 3: sc, 4: sC, 5: sb, 18: sB, 7: sa},
    8: {1: sd, 19: sD, 3: sc, 4: sC, 20: sb, 6: sB, 8: sA},
    9: {2: sD, 3: sc, 4: sC, 5: sb, 6: sB, 7: sa, 21: sA},
    10: {1: sd, 2: sD, 15: sc, 4: sC, 6: sB, 22: sa, 8: sA},
    11: {1: sd, 3: sc, 4: sC, 5: sb, 6: sB, 23: sa, 8: sA},
    12: {1: sd, 2: sD, 3: sc, 13: sC, 5: sb, 7: sa, 24: sA},
    13: {25: sd, 2: sD, 4: sC, 12: sb, 6: sB, 7: sa, 8: sA},
    14: {1: sd, 26: sD, 3: sc, 4: sC, 20: sb, 6: sB, 8: sA},
    15: {1: sd, 27: sD, 3: sc, 5: sb, 10: sB, 7: sa, 8: sA},
    16: {28: sd, 2: sD, 3: sc, 4: sC, 5: sb, 18: sB, 7: sa},
    17: {1: sd, 3: sc, 29: sC, 5: sb, 6: sB, 7: sa, 8: sA},
    18: {1: sd, 2: sD, 30: sc, 4: sC, 6: sB, 16: sa, 8: sA},
    19: {2: sD, 31: sc, 4: sC, 5: sb, 6: sB, 7: sa, 8: sA},
    20: {1: sd, 2: sD, 3: sc, 32: sC, 5: sb, 7: sa, 14: sA},
    21: {1: sd, 19: sD, 3: sc, 4: sC, 34: sb, 6: sB, 8: sA},
    22: {2: sD, 3: sc, 4: sC, 5: sb, 18: sB, 7: sa},
    23: {17: sd, 2: sD, 3: sc, 4: sC, 5: sb, 34: sB, 7: sa},
    24: {1: sd, 3: sc, 4: sC, 20: sb, 6: sB, 8: sA},
    25: {1: sd, 3: sc, 4: sC, 5: sb, 6: sB, 35: sa, 8: sA},
    26: {2: sD, 4: sC, 5: sb, 6: sB, 7: sa, 8: sA},
    27: {2: sD, 3: sc, 4: sC, 5: sb, 6: sB, 7: sa, 36: sA},
    28: {1: sd, 3: sc, 5: sb, 6: sB, 7: sa, 8: sA},
    29: {11: sd, 2: sD, 4: sC, 6: sB, 7: sa, 8: sA},
    30: {1: sd, 3: sc, 5: sb, 10: sB, 7: sa, 8: sA},
    31: {1: sd, 9: sD, 3: sc, 5: sb, 7: sa, 8: sA},
    32: {2: sD, 4: sC, 12: sb, 6: sB, 7: sa, 8: sA},
    33: {1: sd, 9: sD, 3: sc, 5: sb, 7: sa, 14: sA},
    34: {11: sd, 2: sD, 4: sC, 6: sB, 16: sa, 8: sA},
    35: {17: sd, 2: sD, 3: sc, 13: sC, 5: sb, 7: sa},
    36: {1: sd, 19: sD, 15: sc, 4: sC, 6: sB, 8: sA}
}

var surfaceIntervals = [
    new DisconnectedInterval([new Interval(0, 0)]),
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
    new DisconnectedInterval([new Interval(2.858, 2.125)]),
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