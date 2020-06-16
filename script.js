window.onload = () =>{

  let tela = $('#game-canvas');
  let pincel = tela.getContext('2d');

  fix_canvas_proportions(tela);

  let screen_data = { largura: tela.width, 
                      altura: tela.height, 
                      meia_altura: tela.height/2, 
                      meia_largura: tela.width/2
                    }

  let ball = { size: 15, 
               pos_x: 50, 
               pos_y: 80, 
               speed: 100, 
               x_direction: -1,
               y_direction: 1
             }

  let player = { altura: 60, largura: 10, pos_x: 0, pos_y: 90 }
  let computer = { altura: 60, largura: 10, pos_x: screen_data.largura -10, pos_y: 300 }


  track_move_player(player);

  set_ball_position({ball: ball, screen_data: screen_data});

  render({fps: 60, pincel: pincel, screen_data: screen_data, ball:ball, player: player, computer: computer});

  move_ball({ball: ball, screen_data: screen_data, player: player, computer: computer});


  log(screen_data.meia_altura)
}


function set_ball_position({ball, screen_data}){
  ball.pos_x = screen_data.meia_largura;

  let max = screen_data.altura - ball.size -3;
  let min = ball.size + 3;

  ball.pos_y = Math.random() * (max - min) + min;
}

function bounce_ball_computer({ball, player, screen_data}){

  if(ball.pos_x >= screen_data.largura - player.largura - ball.size){

    let player_top = player.pos_y;
    let player_bottom = player.pos_y + player.altura;

    let ball_top = ball.pos_y; 
    let ball_bottom = ball.pos_y + ball.size;

    if(ball_bottom >= player_top && ball_top <= player_bottom){
      ball.x_direction = ball.x_direction * (-1);
    }
  }
}

function bounce_ball_player({ball, player}){

  if(ball.pos_x <= player.largura){

    let player_top = player.pos_y;
    let player_bottom = player.pos_y + player.altura;

    let ball_top = ball.pos_y; 
    let ball_bottom = ball.pos_y + ball.size;

    if(ball_bottom >= player_top && ball_top <= player_bottom){

      ball.x_direction = ball.x_direction * (-1);
    }
  }
}

function bounce_ball({ball, screen_data}){
  if(ball.pos_y <= 0 || ball.pos_y >= screen_data.altura - ball.size){
    ball.y_direction = ball.y_direction * (-1);
  } 
}

function render({fps, pincel, screen_data, ball, player, computer}){
  setInterval(() => {
    draw_field({brush: pincel, field_data: screen_data});
    set_font({brush: pincel, font_size: 1, font_family: 'Arial'});
    write({brush: pincel, text: `FPS: ${fps}`, x_axis: 20, y_axis: 20});

    write({brush: pincel, text: `You: ${fps}`, x_axis: screen_data.meia_largura - 120, y_axis: 20});
    write({brush: pincel, text: `CPU: ${fps}`, x_axis: screen_data.meia_largura + 60, y_axis: 20});

    draw_ball({brush: pincel, ball: ball});  
    draw_player({brush: pincel, player: player}); 
    draw_player({brush: pincel, player: computer});
    
  }, 1000/fps);
}

function track_move_player(player){

  document.addEventListener("mousemove", (event)=>{
    //log(event.clientY)
    player.pos_y = event.clientY - player.altura/2;

  });
}

function move_ball({ball, screen_data, player, computer}){
  setInterval(() => {

    bounce_ball({ball: ball, screen_data: screen_data});
    bounce_ball_player({ball: ball, player: player});
    bounce_ball_computer({ball: ball, player: computer, screen_data: screen_data});

    ball.pos_x = ball.pos_x + ball.x_direction
    ball.pos_y = ball.pos_y + ball.y_direction

  }, 1000/ball.speed);
}

function draw_player({brush, player}){
  set_color({brush: brush, hex_color: '#0c148b'});
  draw_rectangule({ brush, 
                    x_axis: player.pos_x, 
                    y_axis: player.pos_y, 
                    width: player.largura, 
                    height: player.altura
                  });

}

function draw_field({ brush, field_data }){

  set_color({brush: brush, hex_color: '#dadad7'});
  draw_rectangule({ brush, 
                    x_axis: 0, 
                    y_axis: 0, 
                    width: field_data.largura, 
                    height: field_data.altura
                  });

  set_color({brush: brush, hex_color: '#0c148b'});            
  draw_rectangule({ brush, 
                    x_axis: field_data.meia_largura - 2, 
                    y_axis: 0, 
                    width: 5, 
                    height: field_data.altura
                  });                
}

function draw_ball({ brush, ball }){
  set_color({brush: brush, hex_color: '#ff1493'});
  draw_rectangule({ brush, 
                    x_axis: ball.pos_x, 
                    y_axis: ball.pos_y, 
                    width: ball.size, 
                    height: ball.size
                  });
 }

function log(msg){
  //alert(msg)
  console.log(msg);
}

function $(item){
  return document.querySelector(item);
}

function fix_canvas_proportions(canvas){
  canvas.height = window.innerHeight;
  canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);
}

function set_color({brush, hex_color}){
  brush.fillStyle = hex_color;
}

function set_font({brush, font_size, font_family}){
  brush.font = `${font_size}em ${font_family}`;
}

function draw_rectangule({brush, x_axis, y_axis, width, height}){
  brush.fillRect(x_axis, y_axis, width, height);
}

function write({brush, text, x_axis, y_axis}){
  brush.fillText(text, x_axis, y_axis);
}
