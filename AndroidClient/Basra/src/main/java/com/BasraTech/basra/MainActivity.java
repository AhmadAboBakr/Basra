package com.BasraTech.basra;

import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;

import com.koushikdutta.async.http.socketio.Acknowledge;
import com.koushikdutta.async.http.socketio.ConnectCallback;
import com.koushikdutta.async.http.socketio.DisconnectCallback;
import com.koushikdutta.async.http.socketio.ErrorCallback;
import com.koushikdutta.async.http.socketio.EventCallback;
import com.koushikdutta.async.http.socketio.JSONCallback;
import com.koushikdutta.async.http.socketio.SocketIOClient;
import com.koushikdutta.async.http.socketio.StringCallback;
import com.koushikdutta.http.AsyncHttpClient;

import org.json.JSONArray;
import org.json.JSONObject;


public class MainActivity
        extends Activity
        implements
            DisconnectCallback,
            ErrorCallback,
            JSONCallback,
            AsyncHttpClient.StringCallback,
            EventCallback,
            StringCallback
{

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);
        SocketIOClient.connect("http://192.168.1.118:3000",new ConnectCallback() {
            @Override
            public void onConnectCompleted(Exception ex, SocketIOClient client) {
                client.setDisconnectCallback(MainActivity.this);
                client.setErrorCallback(MainActivity.this);
                client.setJSONCallback(MainActivity.this);
                client.setStringCallback(MainActivity.this);
                client.addListener("news", MainActivity.this);

            }
        },new Handler());

    }




    @Override
    public boolean onCreateOptionsMenu(Menu menu) {

        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        Log.d("BasraTest",item.getItemId()+" pressed");

        switch (item.getItemId()) {
            case R.id.action_settings:
                return true;
        }
        return super.onOptionsItemSelected(item);
    }

    //CallBack Methods
    @Override
    public void onDisconnect(Exception e) {

    }

    @Override
    public void onError(String error) {

    }

    @Override
    public void onEvent(String event, JSONArray argument, Acknowledge acknowledge) {

    }

    @Override
    public void onJSON(JSONObject json, Acknowledge acknowledge) {

    }

    @Override
    public void onCompleted(Exception e, String result) {

    }

    @Override
    public void onString(String string, Acknowledge acknowledge) {

    }

}
