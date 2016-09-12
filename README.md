#Lunar Lander Evolution Simulator

This is a simple evolution simulator using randomly generated 'spaceships'. The goal is the moon near the top-right of the screen. At first, two ships are randomly generated. Each ship is given from 3 to 8 engines, and each engine has a random firing angle, firing power, start ('on') time, and shutoff ('end') time. After the initial two ships are created, the following happens:

 1.) The engines start and stop, with appropriate power and angle settings, at the appropriate times.

 2.) The simulation resets once one of the following occurs:

   a.)A ship leaves the screen

   b.)A ship stalls (doesn't move) for more than 20 seconds.

   c.)A ship collides with the moon.

 3.) At this point, the CLOSER ship has a lower score (lower being better), and thus gets priority in the evolution algorithm. That is, its engines are MORE likely to be 'passed on'.

 4.) A new ship is born that's a mixture of the better-scoring ship and the worse-scoring ship, with priority leaning towards the better-scoring one.

 5.) The cycle repeats.