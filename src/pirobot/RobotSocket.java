package pirobot;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;

import java.io.IOException;

public class RobotSocket extends WebSocketAdapter implements ArduinoListener {
    public ArduinoCommunicator arduino = new ArduinoCommunicator();

    @Override
    public void onWebSocketConnect(Session sess)
    {
        super.onWebSocketConnect(sess);
        System.out.println("Socket Connected: " + sess);
        arduino.initialize();
        arduino.setListener(this);
    }
    
    @Override
    public void onWebSocketText(String message)
    {
        super.onWebSocketText(message);
        System.out.println("Received TEXT message: " + message);
        arduino.sendLine(message.charAt(0));
     }
    
    @Override
    public void onWebSocketClose(int statusCode, String reason)
    {
        super.onWebSocketClose(statusCode,reason);
        System.out.println("Socket Closed: [" + statusCode + "] " + reason);
        arduino.close();
    }
    
    @Override
    public void onWebSocketError(Throwable cause)
    {
        super.onWebSocketError(cause);
        cause.printStackTrace(System.err);
    }

    @Override public void receive(String inputLine) {
        try {
            this.getRemote().sendString(inputLine);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
