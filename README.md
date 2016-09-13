#Lunar Lander Evolution Simulator
##Evolution and Punctuated Equilibrium in a Learning Simulation

##Contents:
 * [About](#About)
 * [Generation Iteration](#generation-iteration)
 * [Running](#Running)
 * [Punctuated Equilibrium](#punctuated-equilibrium)
 * [License](#license)
 * [Credits](#credits)

---

###About:
This is a simple evolution simulator using randomly generated 'spaceships'. The goal is the moon near the top-right of the screen. At first, two ships are randomly generated. Each ship is given from 3 to 8 engines, and each engine has a random firing angle, firing power, start ('on') time, and shutoff ('end') time. After the initial two ships are created, the program proceeds to iterate generations.

---

###Generation Iteration:
During each generation, the following happens:

1.) The engines start and stop, with appropriate power and angle settings, at the appropriate times. Each ship has a particular 'genotype' that consists of, basically, the properties of its engines.

 2.) The ships continue to fly until one of the conditions in step 3 is true.

 3.) The simulation resets once one of the following occurs:

  - A ship leaves the screen

  - A ship stalls (no engines fire) for more than 20 seconds.

  - A ship collides with the moon.

4.) Upon reset, we take a look at both ships. Each ship gets a score, which consists of its proximity to the target (the 'moon') and its speed. A lower score is better, and the ship with the better score gets priority in the breeding process (step 5 below). That is, its 'genes' are more likely to be passed on. 

5.) Next, the breeding process. Basically, I loop thru every trait of each ship (and each engine on each ship), and randomly choose one of the following:

  - Large chance: the 'successful' organism's trait is picked.

  - Small chance: the 'unsuccessful' organism's trait is picked.

  - Very small chance: the trait is generated randomly. This introduces an element of random mutation.

6.) These traits are used to generate a new organism. The worse of the two parents is removed, and the better one remains. 

7.) The cycle repeats.

---

###Running:
Firstly, remember that this is a simulation, not a game. As such, you really won't be able to do much without explicitly editing the code. Either way, the procedure for running the game is as follows:

 1.) Open index.html (or visit [this github-pages page](https://newms34.github.io/Lunar-Lander-Evolution-Sim/))

 2.) Wait.

Seriously, that's it. If you're wondering why nothing seems to be happening, learn some biology below.

---

###Punctuated Equilibrium:
####(or, "Why isn't this doing anything?!")

If you're wondering why it appears that nothing's happening, keep in mind the late Stephen Jay Gould's theory of [Punctuated Equilibrium](https://en.wikipedia.org/wiki/Punctuated_equilibrium). Basically, it says that evolution occurs in sudden jumps when nature sort of figures something out. For example, life might generally consist of random blobs until something comes along with a defined head and tail (we call these [bilaterians](https://en.wikipedia.org/wiki/bilateria)). Then nature says "Wow, this is a great idea!" and you get an explosion of new taxa.
This simulation displays a similar behavior. You may not notice anything for the first 30-60 generations (or, rather, the ships will be utter failures). After this initial period, there'll be SOME movement towards the target. The remainder of the simulation will be narrowing down towards an ideal.
The simulation will likely also reach a point beyond which it will not improve. This is realistic, as evolution is *not* goal-driven. That is, while the environment here provides a particular goal resource, there is nothing that explicitly guarantees the ships will reach that goal.

---

###License:

Released under the MIT license. Translation: Do whatever you want with it!

---

###Credits:
Made by me, [David Newman](https://github.com/Newms34)
