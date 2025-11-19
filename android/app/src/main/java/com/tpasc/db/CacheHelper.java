package com.tpasc.db;

import com.legend.bluetooth.fitprolib.model.ClockDialInfoBody;

public class CacheHelper {

    private static ClockDialInfoBody watchInfo;

    public static ClockDialInfoBody getClockDialInfo() {
        return watchInfo;
    }

    public static void setWatchInfo(ClockDialInfoBody watchInfo) {
        CacheHelper.watchInfo = watchInfo;
    }
}
