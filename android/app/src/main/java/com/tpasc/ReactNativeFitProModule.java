package com.tpasc;

import com.blankj.utilcode.util.JsonUtils;
import com.blankj.utilcode.util.MapUtils;
import com.blankj.utilcode.util.NotificationUtils;
import com.blankj.utilcode.util.PermissionUtils;
import com.blankj.utilcode.util.StringUtils;
import com.blankj.utilcode.util.TimeUtils;
import com.blankj.utilcode.util.ToastUtils;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.Manifest;
import android.app.Application;
import android.bluetooth.BluetoothDevice;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.nfc.Tag;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.util.Log;
import android.view.Gravity;
import android.widget.Toast;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.legend.bluetooth.fitprolib.application.Config;
import com.legend.bluetooth.fitprolib.application.FitProSDK;
import com.legend.bluetooth.fitprolib.bluetooth.BleManager;
import com.legend.bluetooth.fitprolib.bluetooth.Profile;
import com.legend.bluetooth.fitprolib.bluetooth.ProfilePlus;
import com.legend.bluetooth.fitprolib.model.ClockDialInfoBody;
import com.legend.bluetooth.fitprolib.model.DeviceHardInfoModel;
import com.legend.bluetooth.fitprolib.model.MeasureBloodModel;
import com.legend.bluetooth.fitprolib.model.MeasureDetailsModel;
import com.legend.bluetooth.fitprolib.model.MeasureHeartModel;
import com.legend.bluetooth.fitprolib.model.MeasureSpoModel;
import com.legend.bluetooth.fitprolib.model.ProductInfoModel;
import com.legend.bluetooth.fitprolib.model.SleepDetailsModel;
import com.legend.bluetooth.fitprolib.model.SportDetailsModel;
import com.legend.bluetooth.fitprolib.receiver.LeReceiver;
import com.legend.bluetooth.fitprolib.utils.SDKTools;
import com.legend.bluetooth.fitprolib.bluetooth.SDKCmdMannager;
import com.legend.bluetooth.fitprolib.utils.SaveKeyValues;
import com.tpasc.db.SqliteDBAcces;

import static com.legend.bluetooth.fitprolib.utils.BleUtils.refreshBleAppFromSystem;
import static com.legend.bluetooth.fitprolib.utils.BleUtils.releaseAllScanClient;
import static com.legend.bluetooth.fitprolib.utils.BleUtils.setLeServiceEnable;
import static com.legend.bluetooth.fitprolib.bluetooth.SendData.getBrightScreenValue;
import static com.legend.bluetooth.fitprolib.bluetooth.SendData.setSendBeforeValue;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class ReactNativeFitProModule extends  ReactContextBaseJavaModule{
    private final String TAG = "FitProManualLog";
    private List<Map<String, Object>> dlist = null;
    private LeReceiver leReceiver;
    private BleManager mBle;
    private final Handler tHandler;
    private List<Map<String, Object>> bluetoothDeviceList;
    public static SqliteDBAcces DBAcces;
    private Application application = null;
    ReactNativeFitProModule(ReactApplicationContext context) {
        super(context);
        bluetoothDeviceList = new ArrayList<>();
        tHandler = new Handler(Looper.getMainLooper()) {
            @Override
            public void handleMessage(Message msg) {
                Log.i(TAG, "isConnected===" + SDKCmdMannager.isConnected());
                Map<String, Object> map = (Map<String, Object>) msg.getData().getSerializable("Datas");//接受msg传递过来的参数
                Log.i(TAG, TAG + "----state-------[" + map.get("state") + "]-----msg.what----" + msg.what);
                String Sql = "";
//                Object stateObject = map.get("state");
//                String arkoState = (stateObject != null) ? stateObject.toString() : "Default State";
//                Map<String, Object> additionalData = new HashMap<>();
//                additionalData.put("what", msg.what);
//                Map<String, Object> combinedData = new HashMap<>(additionalData);
//                combinedData.put("state", arkoState);
//                sendEvent("rawEvent", combinedData.toString());
                switch (msg.what) {
                    case Profile.MsgWhat.what1:
                        BluetoothDevice device = (BluetoothDevice) map.get("device");
                        if (StringUtils.isTrimEmpty(device.getAddress())) {
                            return;
                        }

                        // Create a map representing the Bluetooth device
                        Map<String, Object> map2 = new HashMap<>();
                        map2.put("address", device.getAddress());
                        map2.put("name", device.getName());
                        map2.put("rssi", map.get("rssi"));
                        
                        if (dlist == null) {
                            dlist = new ArrayList<>();
                            dlist.add(map2);
                        }
                        int is_add = 0;
                        boolean _isFastScan = isFastRefresh();
                        for (int i = 0; i < dlist.size(); i++) {
                            if (((Map) dlist.get(i)).get("address").equals(map2.get("address"))) {
                                // if(!_isFastScan) {
                                    dlist.set(i, map2);
                                // }
                                is_add++;
                                break;
                            }
                        }
                        if(is_add == 0) {
                            dlist.add(map2);
                        }
                        if (!_isFastScan) {
                            sendEvent("BluetoothDevices", convertListToJsonArray(dlist));
                        }
                        // if (!isFastRefresh() && dlist.size() > 1) {
                        //     Collections.sort(dlist, new ComparatorValues());
                        // }
                        // int index = findDeviceIndex(device.getAddress());
                        // if (index != -1) {
                        //     bluetoothDeviceList.set(index, map2);
                        // } else {
                        //     bluetoothDeviceList.add(map2);
                        // }
                        break;
                    case Profile.MsgWhat.what2:
                        if (map.get("state").equals("0")) {//断开连接
                            // sendEvent("isWatchConnected", "NO");
                        } else if (map.get("state").equals("1")) {//连接成功
                            sendEvent("isWatchConnected", "YES");
                        }
                        break;
                    case Profile.MsgWhat.what5://步数跟新后会调至这里
                        sendEvent("SQL_LOGS", "what5" + map.get("step"));
                        break;
                    case Profile.MsgWhat.what90://睡眠数据返回
                        SleepDetailsModel sleepItem = (SleepDetailsModel) map.get(SDKTools.EXTRA_DATA);

                        Sql = "insert into Sleep (RevDate,Offset,SleepTypes,Data,LongDate) values ('" + sleepItem.getRevDate() + "'," + sleepItem.getOffset() + "," + sleepItem.getSleepType() + "," + sleepItem.getOffset() + "," + sleepItem.getTime() + ")";
                        DBAcces.Execute(Sql);
                        Log.e(TAG, "Query====:" + Sql);
                        sendEvent("SQL_LOGS", "what90" + Sql);
                        break;
                    case Profile.MsgWhat.what51://运动数据返回
                        SportDetailsModel sportDetailsModel = (SportDetailsModel) map.get(SDKTools.EXTRA_DATA);
                        Log.e(TAG, "sportDetailsModel:" + sportDetailsModel.toString());
                        Sql = "insert into Step (SportDate,ActiveTime,Mode,Offset,Distance,Calory,Steps,LongDate) values ('" + sportDetailsModel.getSysDate() + "'," + sportDetailsModel.getMin() + "," + sportDetailsModel.getMode() + "," + sportDetailsModel.getOffset() + "," + sportDetailsModel.getDistance() + "," + sportDetailsModel.getCalory() + "," + sportDetailsModel.getStep() + "," + sportDetailsModel.getLongDate() + ") ";
                        Log.e(TAG, "Query====:" + Sql);
                        DBAcces.Execute(Sql);
                        sendEvent("SQL_LOGS", "what51" + Sql);
                        sendEvent("hasNewData", "measure");
                        break;
                    case Profile.MsgWhat.what60://心率血压血氧返回
                        MeasureDetailsModel measureDetailsModel = (MeasureDetailsModel) map.get(SDKTools.EXTRA_DATA);
                        SDKTools.hearting = false;
                        String ymd = TimeUtils.millis2String(measureDetailsModel.getTime(), new SimpleDateFormat("yyyy-MM-dd"));
                        String hhmmss = TimeUtils.millis2String(measureDetailsModel.getTime(), new SimpleDateFormat("HH:mm:ss"));
                        Log.e(TAG, "measureDetailsModel:" + measureDetailsModel.toString() + ";ymd:" + ymd + ";hhmm:" + hhmmss);
                        Sql = "insert into Measure (SysDate,RevDate,Heart,hBlood,lBlood,Spo,LongDate) values ('" + ymd + "','" + hhmmss + "','" + measureDetailsModel.getHeart() + "','" + measureDetailsModel.getHblood() + "','" + measureDetailsModel.getLblood() + "','" + measureDetailsModel.getSpo() + "'," + measureDetailsModel.getTime() + ") ";
                        Log.e(TAG, "Query====:" + Sql);
                        sendEvent("SQL_LOGS", "what60" + Sql);
                        DBAcces.Execute(Sql);
                        
                        try {
                            JSONObject rootObject = new JSONObject();
                            rootObject.put("type", "heart");
                            JSONObject dataObject = new JSONObject();
                            dataObject.put("SysDate", ymd);
                            dataObject.put("RevDate", hhmmss);
                            dataObject.put("heart", measureDetailsModel.getHeart());
                            dataObject.put("hblood", measureDetailsModel.getHblood());
                            dataObject.put("lblood", measureDetailsModel.getLblood());
                            dataObject.put("spo", measureDetailsModel.getSpo());
                            dataObject.put("LongDate", measureDetailsModel.getTime());
                            rootObject.put("data", dataObject);
                            sendEvent("DData", rootObject.toString());
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                        break;
                    //下面的数据部分产品可能没有相关协议，以实际产品为准
                    case ProfilePlus.MsgWhat.what1://表盘信息返回
                        ClockDialInfoBody body = (ClockDialInfoBody) map.get(SDKTools.EXTRA_DATA);
//                    CacheHelper.setWatchInfo(body);
//                    EventBus.post(new ClockDialInfoEvent(body, ""));
                        break;
                    case ProfilePlus.MsgWhat.what2://设备信息返回
                        DeviceHardInfoModel deviceInfoA = (DeviceHardInfoModel) map.get(SDKTools.EXTRA_DATA);
                        Log.e(TAG, "deviceInfo:" + deviceInfoA.toString());
                        sendEvent("what2", deviceInfoA.toString());
                        ToastUtils.showShort(deviceInfoA.toString());
                        sendEvent("rawEvent", "deviceInfo" + deviceInfoA.toString());
                        break;
                    case ProfilePlus.MsgWhat.what3://产品信息返回
                        ProductInfoModel productInfo = (ProductInfoModel) map.get(SDKTools.EXTRA_DATA);
                        Log.e(TAG, "deviceInfo:" + productInfo.toString());
                        ToastUtils.showShort(productInfo.toString());
                        break;
                    case Profile.MsgWhat.what69://单个心率返回
                        MeasureHeartModel measureHeartModel = (MeasureHeartModel) map.get(SDKTools.EXTRA_DATA);
                        Log.e(TAG, "measureHeartModel:" + measureHeartModel.toString());
                        ToastUtils.showShort(measureHeartModel.toString());
                        break;
                    case Profile.MsgWhat.what62://单个血压返回
                        MeasureBloodModel measureBloodModel = (MeasureBloodModel) map.get(SDKTools.EXTRA_DATA);
                        Log.e(TAG, "measureBloodModel:" + measureBloodModel.toString());
                        ToastUtils.showShort(measureBloodModel.toString());
                        break;
                    case Profile.MsgWhat.what67://单个血氧返回
                        MeasureSpoModel measureSpoModel = (MeasureSpoModel) map.get(SDKTools.EXTRA_DATA);
                        Log.e(TAG, "measureSpoModel:" + measureSpoModel.toString());
                        ToastUtils.showShort(measureSpoModel.toString());
                        break;
                    case Profile.MsgWhat.what39: // Watch wrist request
                        Log.i(TAG, "Wrist request made");
                        Log.i(TAG, "turi" + (String) map.get(SDKTools.EXTRA_DATA));
                        break;
                    case Profile.MsgWhat.what14:
                        Log.i(TAG, "Wrist data received");
                        Log.i(TAG, "turi" + (String) map.get(SDKTools.EXTRA_DATA));
                        break;
                    default:
                        Log.i(TAG, "Went default");
                        break;
                }
            }
        };
    }
    private int findDeviceIndex(String address) {
        for (int i = 0; i < bluetoothDeviceList.size(); i++) {
            if (bluetoothDeviceList.get(i).get("address").equals(address)) {
                return i;
            }
        }
        return -1;
    }

    public static String convertListToJsonArray(List<Map<String, Object>> dataList) {
        JSONArray jsonArray = new JSONArray();
        try {
            for (Map<String, Object> map : dataList) {
                JSONObject jsonObject = new JSONObject(map);
                jsonArray.put(jsonObject);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return jsonArray.toString();
    }

    @Override
    public String getName() {
        return "ReactNativeFitProModule";
    }

    @ReactMethod
    public void logMessage(String message) {
        Log.d("MyCustomModule", "Received message from React Native: " + message);
    }

    @ReactMethod
    public void initialize() {
        ReactContext reactContext = getReactApplicationContext();
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                PermissionUtils.permission(Manifest.permission.BLUETOOTH_CONNECT, Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.BLUETOOTH_ADVERTISE, Manifest.permission.READ_PHONE_STATE,Manifest.permission.PROCESS_OUTGOING_CALLS,Manifest.permission.READ_EXTERNAL_STORAGE,Manifest.permission.WRITE_EXTERNAL_STORAGE,Manifest.permission.READ_CONTACTS,Manifest.permission.READ_CALL_LOG,Manifest.permission.READ_SMS,Manifest.permission.RECEIVE_SMS).request();
            }
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        if (reactContext != null) {
            Application appsss = (Application) reactContext.getApplicationContext();
            application = appsss;
            String packageName = appsss.getPackageName();
            Log.d(TAG, "Package name is: " + packageName);
            FitProSDK.getFitProSDK()
                    .setConfig(new Config()
                            .setNotificationImportance(NotificationUtils.IMPORTANCE_DEFAULT)
                            .setNotificationTitle("Tpasc Watch")
                            .setNotificationContent("Watch Sync")).init(appsss);
            OpenDataBase();
            leReceiver = new LeReceiver(appsss, tHandler);
            leReceiver.registerLeReceiver();
            mBle = BleManager.getInstance();
            setLeServiceEnable(true);
        }

    }

    @ReactMethod
    public void scanDevices(boolean scanOrNot) {
        mBle.scanLeDevice(scanOrNot);
    }

    @ReactMethod
    public void removeDevice() {
        SDKCmdMannager.unbondWatch();
        SDKTools.mHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
                do_del();
            }
        }, 1000);
    }
    public static void resetTables() {
        if (DBAcces != null) {
            SqliteDBAcces DBAccess = DBAcces;
            DBAccess.Execute("DELETE FROM Measure");
            DBAccess.Execute("DELETE FROM Sleep");
            DBAccess.Execute("DELETE FROM Step");
        }
    }

    private void OpenDataBase() {
        SqliteDBAcces NewDBAccess;
        ReactContext reactContext = getReactApplicationContext();
        try {
            SQLiteDatabase db = reactContext.openOrCreateDatabase(SDKTools.DBNAME, reactContext.MODE_PRIVATE, null);
            if (db == null) {
                Toast.makeText(application, "DB is null", Toast.LENGTH_SHORT).show();
                return;
            }
            NewDBAccess = new SqliteDBAcces(db);
            DBAcces = NewDBAccess;
        } catch (Exception e) {
            Log.i(TAG, "DB exception" + e.getMessage());
            Toast.makeText(application, "DB exception" + e.getMessage(), Toast.LENGTH_SHORT).show();
        }
    }
    public void do_del() {

        Toast toast = Toast.makeText(application, "Deleted device", Toast.LENGTH_SHORT);
        toast.setGravity(Gravity.CENTER, 0, 0);
        toast.show();
        resetTables();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            refreshBleAppFromSystem(application, application.getPackageName());
            //   setLeServiceEnable(true);
            releaseAllScanClient();
        }
        if (SDKTools.mService != null) {
            SDKTools.mService.close();
        }
        /*
        String addr = SaveKeyValues.getStringValues("bluetooth_address", "");
        String url = Constant.wx_sport_url + "?dtype=unbind&addr=" + addr;
        String res = getRequset(url);
        Logdebug("wxSport", res);
        */

        tHandler.postDelayed(new Runnable() {//延迟2秒后跳转
            @Override
            public void run() {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    setLeServiceEnable(false);
                }
//                startActivity(new Intent(context, MainActivity.class));
            }
        }, 1000);
    }
    @ReactMethod
    public void getInfo(final Promise promise) {
                try {
                    JSONObject rootObject = new JSONObject();
                    rootObject.put("connected", SDKCmdMannager.isConnected());
                    rootObject.put("turi", SDKCmdMannager.getDeviceInfo());
                    promise.resolve(rootObject.toString());
                } catch(Exception e) {
                    promise.reject(e);
                }
    }
    public String getDataRaw() {
        try {
            JSONObject rootObject = new JSONObject();
            Cursor cursor =  DBAcces.Query("select * from Measure order by id desc limit 0,1");
            // Cursor stepCursor = DBAcces.Query("select * from Step" + " group by LongDate order by LongDate desc");
            Cursor stepCursor = DBAcces.Query("select * from Step order by id desc limit 0,1");
            if (cursor != null && cursor.getCount() > 0 && cursor.moveToFirst())
            {
                String heart = cursor.getString(cursor.getColumnIndex("Heart"));
                String hblood = cursor.getString(cursor.getColumnIndex("hBlood"));
                String lblood = cursor.getString(cursor.getColumnIndex("lBlood"));
                String spo = cursor.getString(cursor.getColumnIndex("Spo"));
                String t_blood = lblood+"/"+hblood;
                rootObject.put("heart", heart);
                rootObject.put("hblood", hblood);
                rootObject.put("lblood", lblood);
                rootObject.put("spo", spo);
                rootObject.put("t_blood", t_blood);

            }
            JSONArray stepArray = new JSONArray();
            if (stepCursor != null && stepCursor.getCount() > 0) {
                
                while (stepCursor.moveToNext()) {
                    int id = stepCursor.getInt(stepCursor.getColumnIndex("ID"));
                    long longDate = stepCursor.getLong(stepCursor.getColumnIndex("LongDate"));
                    int stept = stepCursor.getInt(stepCursor.getColumnIndex("Steps"));
                    int calory = stepCursor.getInt(stepCursor.getColumnIndex("Calory"));
                    int distance = stepCursor.getInt(stepCursor.getColumnIndex("Distance"));
                    String sportDate = stepCursor.getString(stepCursor.getColumnIndex("SportDate"));
                    Map<String, String> s = new HashMap<>();
                    s.put("id", id + "");
                    s.put("stept", stept + "");
                    s.put("calory", calory + "");
                    s.put("distance", distance + "");
                    s.put("sportDate", sportDate + "");
                    s.put("longDate", longDate + "");
                    stepArray.put(new JSONObject(s));
                }
            }
            rootObject.put("steps", stepArray);
            return rootObject.toString();
        } catch(Exception e) {
            return "null";
        }
    }



    @ReactMethod
    public void getWristInfo() {
        if (SDKTools.BleState == 1) {
            SDKCmdMannager.GetInfoOfWrist();
        } else {
            Log.i(TAG, "ble not connected");
        }
    }
    @ReactMethod
    public void setWatchLongSit() {
        if (SDKTools.BleState == 1) {
            byte[] LongSit = getBrightScreenValue();
            Log.i(TAG, "Current longsit" + LongSit);
            SDKCmdMannager.setHandLight(LongSit);
        }
    }
//    @ReactMethod
//    public void setMessageSetting() {
//        setSendBeforeValue(key, 1, SaveKeyValues.getStringValues(key, "1"));
//        SaveKeyValues.putStringValues(key, val + "");
//    }
//    @ReactMethod
//    public void getMessageSetting(final Promise promise) {
//        try {
//            JSONObject rootObject = new JSONObject();
//            String callState = SaveKeyValues.getStringValues("CALLState", "0");
//            String SMSState = SaveKeyValues.getStringValues("SMSState", "0");
//            String FaceBookState = SaveKeyValues.getStringValues("FaceBookState", "0");
//            String TwitterState = SaveKeyValues.getStringValues("TwitterState", "0");
//            String WhatsappState = SaveKeyValues.getStringValues("WhatsappState", "0");
//            String INSTAGRAMState = SaveKeyValues.getStringValues("INSTAGRAMState", "0");
////            String WECHATState = SaveKeyValues.getStringValues("WECHATState", "0");
//            rootObject.put("heart", heart);
//        } catch(Exception e) {
//            promise.reject(e);
//        }
//    }
    @ReactMethod
    public void getData(final Promise promise) {
        try {
            JSONObject rootObject = new JSONObject();
            Cursor cursor =  DBAcces.Query("select * from Measure order by id desc limit 0,1");
            Cursor stepCursor = DBAcces.Query("select * from Step" + " group by LongDate order by LongDate desc");
            if (cursor != null && cursor.getCount() > 0 && cursor.moveToFirst())
            {
                String heart = cursor.getString(cursor.getColumnIndex("Heart"));
                String hblood = cursor.getString(cursor.getColumnIndex("hBlood"));
                String lblood = cursor.getString(cursor.getColumnIndex("lBlood"));
                String spo = cursor.getString(cursor.getColumnIndex("Spo"));
                String t_blood = lblood+"/"+hblood;
                rootObject.put("heart", heart);
                rootObject.put("hblood", hblood);
                rootObject.put("lblood", lblood);
                rootObject.put("spo", spo);
                rootObject.put("t_blood", t_blood);

            }
            JSONArray stepArray = new JSONArray();
            if (stepCursor != null && stepCursor.getCount() > 0) {
                
                while (stepCursor.moveToNext()) {
                    int id = stepCursor.getInt(stepCursor.getColumnIndex("ID"));
                    long longDate = stepCursor.getLong(stepCursor.getColumnIndex("LongDate"));
                    int stept = stepCursor.getInt(stepCursor.getColumnIndex("Steps"));
                    int calory = stepCursor.getInt(stepCursor.getColumnIndex("Calory"));
                    int distance = stepCursor.getInt(stepCursor.getColumnIndex("Distance"));
                    String sportDate = stepCursor.getString(stepCursor.getColumnIndex("SportDate"));
                    Map<String, String> s = new HashMap<>();
                    s.put("stept", stept + "");
                    s.put("calory", calory + "");
                    s.put("distance", distance + "");
                    s.put("sportDate", sportDate + "");
                    s.put("longDate", longDate + "");
                    stepArray.put(new JSONObject(s));
                }
            }
            rootObject.put("steps", stepArray);
            promise.resolve(rootObject.toString());
        } catch(Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void sendCommand(String command) {
        // ToastUtils.showShort("Namssakar sir");
        sendEvent("isWatchConnected", SDKCmdMannager.isConnected() ? "YES" : "NO");
        try {
            Class<?> sdkCmdManagerClass = Class.forName("com.legend.bluetooth.fitprolib.bluetooth.SDKCmdMannager");
            Method method = sdkCmdManagerClass.getDeclaredMethod(command);
            method.invoke(sdkCmdManagerClass.newInstance());
        } catch (ClassNotFoundException | NoSuchMethodException | IllegalAccessException | InstantiationException | InvocationTargetException e) {
                e.printStackTrace();
            }

    }
//    SDKTools.hearting = !SDKTools.hearting;
    @ReactMethod
    public void startMeasureHeatRate() {
        // ToastUtils.showShort("Measuring heartbeat");
        sendEvent("isWatchConnected", SDKCmdMannager.isConnected() ? "YES" : "NO");
        SDKTools.hearting = true;
        SDKCmdMannager.startMeasureHeatRate();
    }

    @ReactMethod
    public void getTotalSportData() {
        ToastUtils.showShort("Getting sport Data");
        SDKCmdMannager.getTotalSportData();
    }
    @ReactMethod
    public void connectDevice(String addr) {
        Log.i(TAG, "Connecting...." + addr);
        mBle.scanLeDevice(false);
        if (SDKTools.mService != null) {
            tHandler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    SDKTools.mService.connect2(addr);
                }
            }, 1000);
        } else {
            Log.i(TAG, "No SDKTools....");
        }
    }
    @ReactMethod
    public void performOperation(String addr, final Callback callback) {
        tHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
                // Perform the operation, here just a sample result
                String result = "Result from operation";

                // Send the result back via the callback
                callback.invoke(result);
            }
        }, 1000);
    }

    // Method to send events to React Native
    private void sendEvent(String eventName, String state) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, state);
    }

    // private final class ComparatorValues implements Comparator<Map> {
    //     @Override
    //     public int compare(Map object1, Map object2) {
    //         int m1 = (int) object1.get("rssi");
    //         int m2 = (int) object2.get("rssi");
    //         int result = 0;
    //         if (m1 < m2) {
    //             result = 1;
    //         }
    //         if (m1 > m2) {
    //             result = -1;
    //         }
    //         return result;
    //     }
    // }

    private long lastClickTime = 0;
    private int spaceTime = 3000;

     public boolean isFastRefresh() {
        long currentTime = System.currentTimeMillis();
        boolean isFastClick;//是否允许点击
        if (currentTime - lastClickTime > spaceTime) {
            isFastClick = false;
            lastClickTime = currentTime;
        } else {
            isFastClick = true;
        }
        return isFastClick;
    }
}

