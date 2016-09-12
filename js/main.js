var app = angular.module('lb-app', []).controller('ground-control', function($scope, $interval) {
    //ground-control ===> major tom
    // NOTE: I may wanna change this so that the new 'baby' is a product of the better parent and a randomly generated parent, and NOT better parent + worse parent.
    $scope.w = $(window).width();
    $scope.h = $(window).height();
    $scope.g = .1; //gravity!
    $scope.engines = [];
    $scope.bestWorstMode = false;
    $scope.gens=0;
    $scope.ships = [];
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
    }
    $scope.mutaRate = 0.9
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
                if ($scope.ships[n].engHasFired) {
                    $scope.ships[n].dy += $scope.g;
                    console.log('gravity added')
                }
                $scope.ships[n].x += Math.floor($scope.ships[n].dx);
                $scope.ships[n].y += Math.floor($scope.ships[n].dy);
                var prox = $scope.getDist($scope.ships[n].x, $scope.ships[n].y, $scope.moon.x * $scope.w, $scope.moon.y * $scope.h);
                $scope.ships[n].score = prox;
                //detect boundz 
                if ($scope.ships[n].x < 0 || $scope.ships[n].x > $scope.w - 50 || $scope.ships[n].y < 0 || $scope.ships[n].y > $scope.h - 50) {
                    $scope.restart = true;
                }
                //stalling prevention
                if($scope.ships[n].lastDeactivatedTime && typeof $scope.ships[n].lastDeactivatedTime == 'number' && new Date().getTime() - $scope.ships[n].lastDeactivatedTime < 20000){
                	$scope.allStalled=false;
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
                    var angle = 90+Math.floor(Math.random() * 180),
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
            if(!$scope.bestWorstMode){
            	//first parent is 'gud', second parent is random
            	var arr = [];
                var numEngs = 3 + Math.ceil(Math.random() * 5);
                for (var i = 0; i < numEngs; i++) {
                    var angle = 90+Math.floor(Math.random() * 180),
                        power = Math.random() * 10,
                        start = Math.floor(Math.random() * 20000),
                        end = Math.floor(Math.random() * 20000);
                    arr.push(new $scope.Thruster(angle, power, start, end));
                }
                bad = new $scope.shipCon(arr);
            }
            var numEngs = Math.random() < .7 ? gud.engines.length : bad.engines.length,
                engArr = [],
                mutation=false;
            if (Math.random() > $scope.mutaRate && $scope.bestWorstMode) {
                //randomly change number of engines
                mutation=true;
                if (Math.random() > .5) {
                    numEngs++;
                } else {
                    numEngs--;
                }
            }
            
            for (i = 0; i < numEngs; i++) {
                try {

                    var angle = Math.random() < .7 ? gud.engines[i].a : bad.engines[i].a,
                        power = Math.random() < .7 ? gud.engines[i].p : bad.engines[i].p,
                        start = Math.random() < .7 ? gud.engines[i].s : bad.engines[i].s,
                        end = Math.random() < .7 ? gud.engines[i].e : bad.engines[i].e;
                } catch (e) {
                    $scope.ticker = null;
                    alert('ERROR OCCURED! Check console')
                    console.log(e, gud, bad)
                }
                //now optionally mutate engines
                if (Math.random() > $scope.mutaRate && $scope.bestWorstMode) {
                	mutation=true;
                    angle = Math.floor(Math.random() * 360);
                }
                if (Math.random() > $scope.mutaRate && $scope.bestWorstMode) {
                	mutation=true;
                    power = Math.random() * 10;
                }
                if (Math.random() > $scope.mutaRate && $scope.bestWorstMode) {
                	mutation=true;
                    start = Math.floor(Math.random() * 20000);
                }
                if (Math.random() > $scope.mutaRate && $scope.bestWorstMode) {
                	mutation=true;
                    end = Math.floor(Math.random() * 20000);
                }
                engArr.push(new $scope.Thruster(angle, power, start, end));
            }
            if(mutation){
            	$('#muta').show(500).hide(500);
            }
            $scope.ships = [new $scope.shipCon(gud.engines),new $scope.shipCon(engArr)];
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
