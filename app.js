// create a player
// shoot ptojecticles create enemies
// detect collision on enemies / projectile hit 
// detect collision on enemy / player hit 
// remove off screen projectiles 
// colorize game 
// shrink enemies on hit 
// create particle explosion on hit
// add score 
// add game over ui
// add restart restart button 
// add starty game button






const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); 

canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEl = document.querySelector('#scoreEl')
const startGameBtn = document.querySelector('#startGameBtn')
const modalEl = document.querySelector('#modalEl')
const bigscore = document.querySelector('#bigscore')




//create a player
class Player {
    constructor(x, y, radius, color){
        this.x = x
        this.y = y 
        this.radius = radius
        this.color = color
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill();
    }
}

//create a projectile
class Projectile {
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y 
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill();
    }


    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
    
}


//create a enemy
class Enemy {
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y 
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill();
    }


    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

const friction = 0.99
//create a particle
class Particle {
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y 
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }
    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill();
        c.restore()
    }


    update() {
        this.draw()
        this.velocity.x *= friction 
        this.velocity.y *= friction 
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }
}




const x = canvas.width / 2
const y = canvas.height / 2

let player = new Player(x, y, 25, 'white')
let projectiles = []
let enemies = []
let particles = []


function init() {
 player = new Player(x, y, 25, 'white')
 projectiles = []
 enemies = []
 particles = []
 score = 0
 scoreEl.innerHTML = 0
 bigscore.innerHTML = 0
}



function spawnEnemies() {
   setInterval (() => {
        const radius = Math.random() * (30 - 5) + 5
     let x 
     let y
     if (Math.random() < 0.5) {
         x = Math.random() < 0.5 ? 0 - radius : canvas.width  + radius;
         y = Math.random() * canvas.height
     } else {
        x = Math.random() * canvas.width
       y = Math.random() < 0.5 ? 0 - radius : canvas.height  + radius;
     }
     const color = `hsl(${Math.random() * 360}, 50%, 50% )`

     const angle = Math.atan2(
        canvas.height / 2 -y,
        canvas.width / 2 - x
    )
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
    }

     enemies.push(new Enemy( x, y, radius, color, velocity))
    }, 2000)
}



let animationId
let score = 0
function animate() {
   animationId =  requestAnimationFrame(animate)
   c.fillStyle = 'rgba(0,0,0,0.4)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()
    particles.forEach((particle, index ) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        }else{
        particle.update()}
    });
    projectiles.forEach((projectile) => {
        projectile.update()
        // if (projectile.x - projectile.radius < 0){
        //     projectiles.length = 0;
        // }
         
        })
    enemies.forEach((Enemy, index) => {
        Enemy.update()
        const dist = Math.hypot(player.x - Enemy.x,
           player.y - Enemy.y)
           if (dist - Enemy.radius - player.radius < 0) {
          cancelAnimationFrame(animationId);
          modalEl.style.display = 'flex'
          bigscore.innerHTML = score;
          document.getElementById('boo').play();
           }
           if (dist - Enemy.radius - player.radius < 12) {
           setTimeout(() => { projectiles.length = 0;
             }, 0)
            }

        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - Enemy.x,
                 projectile.y - Enemy.y)

/////////when projectiles hit enemies//////////

        if (dist - Enemy.radius - projectile.radius < 1) {
        

                ////increse score




////////////////////////create explosions////////////

            for (let i = 0; i < Enemy.radius * 2; i++) {
                particles.push(particle = new Particle(projectile.x, projectile.y,
                     Math.random() * 2,
                    Enemy.color,
                     {x:( Math.random() - 0.5) * (Math.random() * 8),
                    y:( Math.random() - 0.5) * (Math.random() * 8)
                        }))
            }

             if (Enemy.radius - 10 > 50) {
                 //increase score
                score += 100   
                scoreEl.innerHTML = score;
                //  gsap.to(Enemy, {
                //     radius: Enemy.radius - 10
                
                //  })
                 setTimeout(() => {
                    projectiles.splice(projectileIndex, 1)
                }, 0) 
             } else {
                score += 250   
                scoreEl.innerHTML = score
           
            setTimeout(() => {
                enemies.splice(index, 1)
                projectiles.splice(projectileIndex, 1)
            }, 0) }
        }

        });
      })
}


window.addEventListener('click', (event) => {
    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    )
    const velocity = {
        x: Math.cos(angle) * 4,
        y: Math.sin(angle) * 4 ,
    }
   projectiles.push(
    projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity)
   );

   document.getElementById('ufo').play();
    

})
startGameBtn.addEventListener('click', () => {
    init()
animate()
spawnEnemies()

modalEl.style.display = 'none'

} )


