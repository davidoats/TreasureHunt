package entity;

import main.KeyHandler;

import java.awt.Graphics2D;
import java.awt.Rectangle;
import java.awt.image.BufferedImage;
import java.io.IOException;

import javax.imageio.ImageIO;

import main.GamePanel;

public class Player extends Entity{
  
  GamePanel gp;
  KeyHandler keyH;

  public final int screenX;
  public final int screenY;

  public Player(GamePanel gp, KeyHandler keyH) {
    this.gp = gp;
    this.keyH = keyH;

    screenX = GamePanel.screenWidth/2 - (GamePanel.tileSize/2);
    screenY = GamePanel.screenHeight/2 - (GamePanel.tileSize/2);

    solidArea = new Rectangle(20,24,24,32);    //Player Colision Hitbox


    setDefaultValues();
    getPlayerImage();
  }

  public void setDefaultValues() {
      WorldX = GamePanel.tileSize *23;
      WorldY = GamePanel.tileSize *21;
      //speed = 4;
      speed = gp.worldWidth/800;
      direction = "down";
  }

  public void getPlayerImage() {
    try {
      up1 = ImageIO.read(getClass().getResourceAsStream("/res/player/boy_up_1.png"));
      up2 = ImageIO.read(getClass().getResourceAsStream("/res/player/boy_up_2.png"));
      down1 = ImageIO.read(getClass().getResourceAsStream("/res/player/boy_down_1.png"));
      down2 = ImageIO.read(getClass().getResourceAsStream("/res/player/boy_down_2.png"));
      left1 = ImageIO.read(getClass().getResourceAsStream("/res/player/boy_left_1.png"));
      left2 = ImageIO.read(getClass().getResourceAsStream("/res/player/boy_left_2.png"));
      right1 = ImageIO.read(getClass().getResourceAsStream("/res/player/boy_right_1.png"));
      right2 = ImageIO.read(getClass().getResourceAsStream("/res/player/boy_right_2.png"));
    }catch(IOException e) {e.printStackTrace();}
  }

  public void update() {
    if(keyH.upPressed == true) {
        direction = "up";
      } else if(keyH.downPressed == true) {
        direction = "down";
      } else if(keyH.rightPressed == true) {
        direction = "right";
      } else if(keyH.leftPressed == true) {
        direction = "left";
      } 

      if(keyH.upPressed == true || keyH.downPressed == true || keyH.leftPressed == true|| keyH.rightPressed == true) {
        spriteCounter++;

        collisionOn = false;
      gp.cChecker.checkTile(this);

      if(collisionOn == false) {
        switch(direction) {
          case "up":
            WorldY = WorldY - speed;
            break;
          case "down":
            WorldY = WorldY + speed;
            break;
          case "left":
            WorldX = WorldX - speed;
            break;
          case "right":
            WorldX = WorldX + speed;
            break;
        }
      }

      }
      if(spriteCounter > 15) {
        if(spriteNum == 1) {spriteNum =2;}
        else if(spriteNum ==2) {spriteNum =1;}
        spriteCounter = 0;
      }

      gp.zoomInOut();
  }

  public void draw(Graphics2D g2) {
   // g2.setColor(Color.white);
   // g2.fillRect(x, y, GamePanel.tileSize, GamePanel.tileSize);

   BufferedImage image = null;

   switch(direction) {
    case "up":
      if(spriteNum == 1) {image = up1;}
      if(spriteNum == 2) {image = up2;}
      break;
    case "down":
      if(spriteNum == 1) {image = down1;}
      if(spriteNum == 2) {image = down2;}
      break;
    case "left":
      if(spriteNum == 1) {image = left1;}
      if(spriteNum == 2) {image = left2;}

      break;
    case "right":
      if(spriteNum == 1) {image = right1;}
      if(spriteNum == 2) {image = right2;}
      break;
   }
   g2.drawImage(image, screenX, screenY, GamePanel.tileSize, GamePanel.tileSize, null);
  }

}
