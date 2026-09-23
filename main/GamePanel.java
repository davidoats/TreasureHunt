package main;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import javax.swing.JPanel;
import entity.Player;
import object.SuperObject;
import tile.TileManager;

public class GamePanel extends JPanel implements Runnable{
  
  //SREEN SETTINGS
  static final int originalTileSize =16; //16x16 Tile
  static int scale = 4;

  public static int tileSize = originalTileSize * scale; //48x48 Tiles
  public static int maxScreenCol = 16;
  public static int maxScreenRow = 12;
  public static int screenWidth = maxScreenCol * tileSize;
  public static int screenHeight = maxScreenRow * tileSize;

  //WORLD SETTINGS
  public final int maxWorldCol = 50;
  public final int maxWorldRow = 50;
  public final int worldWidth = tileSize * maxWorldCol;
  public final int worldHeight = tileSize * maxWorldRow;

  //FPS
  int FPS = 120;

  static Dimension screenDimension = new Dimension(screenWidth, screenHeight);

  public CollisionChecker cChecker = new CollisionChecker(this);
  public AssetSetter aSetter = new AssetSetter(this);
  TileManager tileM = new TileManager(this);
  KeyHandler keyH = new KeyHandler(this);
  Thread gameThread;
  public Player player = new Player(this,keyH);
  public SuperObject obj[] = new SuperObject[10];

  public GamePanel() {
    this.setPreferredSize(screenDimension);
    this.setBackground(Color.BLACK);
    this.setDoubleBuffered(true);
    this.addKeyListener(keyH);
    this.setFocusable(true);
  }

  public void setupGame() {
    aSetter.setObject();
  }

  int zoomCounter = 0;
  public void zoomInOut() {
    int oldWorldWidth = tileSize * maxWorldCol;
      zoomCounter++;
    if(keyH.zoomActive == true) {
      if(zoomCounter > 1) {                       //Zoom In and Out Animations
        if(tileSize == 64) {tileSize = 62;zoomCounter =0;} 
        else if(tileSize == 62) {tileSize = 60;zoomCounter=0;}
        else if(tileSize == 60) {tileSize = 58;zoomCounter=0;}
        else if(tileSize == 58) {tileSize = 56;zoomCounter=0;}    
        else if(tileSize == 56) {tileSize = 54;zoomCounter=0;}
        else if(tileSize == 54) {tileSize = 52;zoomCounter=0;}
        else if(tileSize == 52) {tileSize = 50;zoomCounter=0;}
        else if(tileSize == 50) {tileSize = 48;zoomCounter=0;}
        else if(tileSize == 48) {tileSize = 46;zoomCounter=0;}
        else if(tileSize == 46) {tileSize = 44;zoomCounter=0;}
        else if(tileSize == 44) {tileSize = 42;zoomCounter=0;}
      } 
    } else if(keyH.zoomActive == false) {
      if(zoomCounter > 1) {
        if(tileSize == 42) {tileSize = 44;zoomCounter =0;} 
        else if(tileSize == 44) {tileSize = 46;zoomCounter=0;}
        else if(tileSize == 46) {tileSize = 48;zoomCounter=0;}
        else if(tileSize == 48) {tileSize = 50;zoomCounter=0;}
        else if(tileSize == 50) {tileSize = 52;zoomCounter=0;}
        else if(tileSize == 52) {tileSize = 54;zoomCounter=0;}
        else if(tileSize == 54) {tileSize = 56;zoomCounter=0;}
        else if(tileSize == 56) {tileSize = 58;zoomCounter=0;}
        else if(tileSize == 58) {tileSize = 60;zoomCounter=0;}
        else if(tileSize == 60) {tileSize = 62;zoomCounter=0;}
        else if(tileSize == 62) {tileSize = 64;zoomCounter=0;}
      } 
    }
    int newWorldWidth = tileSize * maxWorldCol;
    double multiplier = (double) newWorldWidth/oldWorldWidth;

    double newPlayerWorldX = player.WorldX * multiplier;
    double newPlayerWorldY = player.WorldY * multiplier;

    player.WorldX = newPlayerWorldX;
    player.WorldY = newPlayerWorldY;

    player.speed = (double)newWorldWidth/800;
  }

  public void startGameThread() {
    gameThread = new Thread(this);
    gameThread.start();
  }

  @Override
  public void run() {
    
    while(gameThread != null) {
      // Set FPS
     
      //Using Sleep Method
      double drawInterval = 1000000000/FPS; // 1 second = 1 bil nanosec  0.016666 seconds per frame
      double nextDrawTime = System.nanoTime() + drawInterval;

     //UPDATE: update information like charactor pos.
     update();

     //DRAW: draw screen with updated info
     repaint();

      try {
        double remainingTime = nextDrawTime - System.nanoTime();
        remainingTime = remainingTime/1000000;

        if (remainingTime < 0) {remainingTime = 0;} //incase takes longer to draw than out sleeptime **FPS TOO high??

        Thread.sleep((long) remainingTime); //SLeep takes millisecs MUST Convert

        nextDrawTime += drawInterval;
      } catch (InterruptedException e) {
      
        }
    }
  }

  public void update() {
      player.update();

  }

  public void paintComponent(Graphics g) {

    super.paintComponent(g);

    Graphics2D g2 = (Graphics2D)g;

    tileM.draw(g2);
    
    for(int i =0; i<obj.length; i++) {
      if (obj[i] != null) {
        obj[i].draw(g2, this);
      }
    }

    player.draw(g2);
    g2.dispose();
  }
}
