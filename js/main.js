var app = angular.module('lb-app', []).controller('ground-control', function($scope, $interval) {
    //ground-control ===> major tom
    // NOTE: I may wanna change this so that the new 'baby' is a product of the better parent and a randomly generated parent, and NOT better parent + worse parent.
    $scope.w = $(window).width();
    $scope.h = $(window).height();
    $scope.g = .1; //gravity!
    $scope.engines = [];
    $scope.bestWorstMode = true;
    $scope.gens = 0;
    $scope.ships = [];
    $scope.bestScore = 1000000;
    $scope.Thruster = function(a, p, s, e) {
        /*props: 
        a: angle on ship (0-360)
        p: power
        s: start time
        e: end time
        success: was this engine helpful?
        */
        this.a = a;
        this.p = p;
        this.s = s;
        this.e = e;
        this.success = 1;
        this.on = false;
    }
    $scope.shipCon = function(e) {
        this.engines = e;
        this.x = Math.floor($scope.w / 2);
        this.y = $scope.h - 52;
        this.dx = 0;
        this.dy = 0;
        this.fuel = 500;
        this.start = new Date().getTime();
        this.engHasFired = false;
        this.lastDeactivatedTime = false;
        this.score = 0;
        this.pointerAng = 0;
    }
    $scope.mutaRate = 0.75;
    $scope.mutation = false;
    $scope.moon = {
        x: .6,
        y: .2
    }
    $scope.getDist = function(xi, yi, xf, yf) {
        return Math.sqrt(Math.pow(Math.abs(xf - xi), 2) + Math.pow(Math.abs(yf - yi), 2));
    }
    $scope.allStalled = false;
    $scope.ticker = $interval(function() {
        if (!$scope.restart) {
            $scope.allStalled = true;
            for (var n = 0; n < $scope.ships.length; n++) {
                var dxTotal = 0,
                    dyTotal = 0,
                    now = new Date().getTime();
                for (var i = 0; i < $scope.ships[n].engines.length; i++) {
                    var numEngsOn = 0;
                    if (($scope.ships[n].engines[i].s + $scope.ships[n].start) < now && ($scope.ships[n].engines[i].e + $scope.ships[n].engines[i].s + $scope.ships[n].start) > now) {
                        //engine on, so add its info to the total dx,dy
                        $scope.ships[n].engines[i].on = true;
                        dxTotal -= $scope.ships[n].engines[i].p * Math.sin($scope.ships[n].engines[i].a * Math.PI / 180);
                        dyTotal += $scope.ships[n].engines[i].p * Math.cos($scope.ships[n].engines[i].a * Math.PI / 180);
                        numEngsOn++;
                        $scope.ships[n].lastDeactivatedTime = false; //engs on, so this is false
                        $scope.ships[n].engHasFired = true;
                    } else {
                        $scope.ships[n].engines[i].on = false;
                    }
                    if (!numEngsOn && !$scope.ships[n].lastDeactivatedTime && typeof $scope.ships[n].lastDeactivatedTime != 'number') {
                        //no engines active, and last engine time not yet set
                        $scope.ships[n].lastDeactivatedTime = new Date().getTime();
                    }
                }
                $scope.ships[n].dx += Math.floor(dxTotal) * .01;
                $scope.ships[n].dy += Math.floor(dyTotal) * .01;
                $scope.ships[n].pointerAng = Math.atan((0 - $scope.ships[n].dy) / (0 - $scope.ships[n].dx)) * 180 / Math.PI;
                if ($scope.ships[n].dy <= 0) {
                    $scope.ships[n].pointerAng -= 180;
                }
                if ($scope.ships[n].engHasFired) {
                    $scope.ships[n].dy += $scope.g;
                    console.log('gravity added')
                }
                $scope.ships[n].x += Math.floor($scope.ships[n].dx);
                $scope.ships[n].y += Math.floor($scope.ships[n].dy);
                var prox = $scope.getDist($scope.ships[n].x, $scope.ships[n].y, $scope.moon.x * $scope.w, $scope.moon.y * $scope.h);
                var vTotal = $scope.getDist($scope.ships[n].dx, 0, $scope.ships[n].dy, 0);
                $scope.ships[n].score = prox + vTotal;
                if (Math.floor($scope.ships[n].score)<$scope.bestScore){
                    $scope.bestScore = Math.floor($scope.ships[n].score);
                }
                //detect boundz 
                if ($scope.ships[n].x < 0 || $scope.ships[n].x > $scope.w - 50 || $scope.ships[n].y < 0 || $scope.ships[n].y > $scope.h - 50) {
                    $scope.restart = true;
                }
                //stalling prevention
                if ($scope.ships[n].lastDeactivatedTime && typeof $scope.ships[n].lastDeactivatedTime == 'number' && new Date().getTime() - $scope.ships[n].lastDeactivatedTime < 20000) {
                    $scope.allStalled = false;
                }
                if ($scope.allStalled) {
                    $scope.restart = true;
                }
                //detect moonage
                if (prox < 100) {
                    $scope.restart = true
                }
            }
        } else {
            $scope.init();
        }
    }, 50);
    $scope.makeNewShip = function(gud, bad) {
        $scope.gens++;
        console.log('SHIP FACTORY', gud, bad)
        if (!gud || !bad) {
            console.log('one of your ships isnt defined')
                //no ships, so make 2
            var engs = [];
            for (var e = 0; e < 2; e++) {
                var arr = [];
                var numEngs = 3 + Math.ceil(Math.random() * 5);
                for (var i = 0; i < numEngs; i++) {
                    var angle = 90 + Math.floor(Math.random() * 180),
                        power = Math.random() * 10,
                        start = Math.floor(Math.random() * 20000),
                        end = Math.floor(Math.random() * 20000);
                    arr.push(new $scope.Thruster(angle, power, start, end));
                }
                engs.push(arr);
            }
            $scope.ships.push(new $scope.shipCon(engs[0]), new $scope.shipCon(engs[1]));
            console.log($scope.ships)
        } else {
            if (!$scope.bestWorstMode) {
                //first parent is 'gud', second parent is random
                var arr = [];
                var numEngs = 3 + Math.ceil(Math.random() * 5);
                for (var i = 0; i < numEngs; i++) {
                    var angle = 90 + Math.floor(Math.random() * 180),
                        power = Math.random() * 10,
                        start = Math.floor(Math.random() * 20000),
                        end = Math.floor(Math.random() * 20000);
                    arr.push(new $scope.Thruster(angle, power, start, end));
                }
                bad = new $scope.shipCon(arr);
            }
            var numEngs = Math.random() < .7 ? gud.engines.length : bad.engines.length,
                engArr = [];
            $scope.mutation = false;
            var whichMut = false;
            if (Math.random() > $scope.mutaRate) {
                whichMut = Math.random();
                $scope.mutation = 'number';
            }
            if (whichMut < .2) {
                //randomly change number of engines
                if (Math.random() > .5) {
                    numEngs++;
                } else {
                    numEngs--;
                }
            } else {
                var alreadyMut = false;
            }

            for (i = 0; i < numEngs; i++) {
                try {
                    var angle = 0,
                        power = 0,
                        start = 0,
                        end = 0;
                    if (!gud.engines[i]) {
                        //no gud engine at this point, so just use bad
                        angle = bad.engines[i].a;
                        power = bad.engines[i].p;
                        start = bad.engines[i].s;
                        end = bad.engines[i].e;
                    } else if (!bad.engines[i]) {
                        //no bad engine at this point, so just use gud
                        angle = gud.engines[i].a;
                        power = gud.engines[i].p;
                        start = gud.engines[i].s;
                        end = gud.engines[i].e;
                    } else {
                        //both engines exist
                        angle = Math.random() < .7 && gud.engines[i] ? gud.engines[i].a : bad.engines[i].a,
                            power = Math.random() < .7 && gud.engines[i] ? gud.engines[i].p : bad.engines[i].p,
                            start = Math.random() < .7 && gud.engines[i] ? gud.engines[i].s : bad.engines[i].s,
                            end = Math.random() < .7 && gud.engines[i] ? gud.engines[i].e : bad.engines[i].e;
                    }

                } catch (e) {
                    $scope.ticker = null;
                    console.log(e, gud, bad)
                }
                //now optionally mutate engines
                if (whichMut >= .2 && whichMut < .4 && Math.random() > (1 / numEngs) && !alreadyMut) {
                    angle = Math.floor(Math.random() * 360);
                    alreadyMut = true;
                    $scope.mutation = 'angle';
                }
                if (whichMut >= .4 && whichMut < .6 && Math.random() > (1 / numEngs) && !alreadyMut) {
                    power = Math.random() * 10;
                    alreadyMut = true;
                    $scope.mutation = 'power';
                }
                if (whichMut >= .6 && whichMut < .8 && Math.random() > (1 / numEngs) && !alreadyMut) {
                    start = Math.floor(Math.random() * 20000);
                    alreadyMut = true;
                    $scope.mutation = 'start';
                }
                if (whichMut >= .8 && Math.random() > (1 / numEngs) && !alreadyMut) {
                    end = Math.floor(Math.random() * 20000);
                    alreadyMut = true;
                    $scope.mutation = 'end';
                }
                engArr.push(new $scope.Thruster(angle, power, start, end));
            }
            if ($scope.mutation) {
                $('#muta').show(500).hide(1200);
            }
            $scope.ships = [new $scope.shipCon(gud.engines), new $scope.shipCon(engArr)];
        }
    }
    $scope.init = function() {
        //set up initial pos of ships @ bottom of screen
        //this is run every time we get a new 'generation'
        if (!$scope.ships.length) {
            $scope.makeNewShip();
        } else {
            if ($scope.ships[0].score < $scope.ships[1].score) {
                //ship1 did better than ship2.
                $scope.makeNewShip($scope.ships[0], $scope.ships[1]);
            } else {
                $scope.makeNewShip($scope.ships[1], $scope.ships[0]);
            }
        }
        $scope.restart = false;
        console.log('NEW SHIPS!', $scope.ships)
    };
    $scope.init();
})
