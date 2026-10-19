package com.playtube.streamer;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.media.session.MediaSession;
import android.media.session.PlaybackState;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;

public class MediaPlaybackService extends Service {
    public static final String CHANNEL_ID = "playtube_media_channel";
    public static final int NOTIFICATION_ID = 8801;
    public static final String ACTION_START = "ACTION_START";
    public static final String ACTION_STOP = "ACTION_STOP";
    public static final String ACTION_PLAY = "ACTION_PLAY";
    public static final String ACTION_PAUSE = "ACTION_PAUSE";
    public static final String EXTRA_TITLE = "EXTRA_TITLE";
    public static final String EXTRA_ARTIST = "EXTRA_ARTIST";

    private PowerManager.WakeLock wakeLock;
    private MediaSession mediaSession;

    @Override
    public void onCreate() {
        super.onCreate();
        try {
            PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
            if (pm != null) {
                wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "PlayTube:MediaPlaybackWakeLock");
                wakeLock.acquire(180 * 60 * 1000L); // 3 hours keepalive
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Initialize Android System MediaSession for official lock screen media controls & exempting from OS audio freeze
        try {
            mediaSession = new MediaSession(this, "PlayTubeMediaSession");
            mediaSession.setFlags(MediaSession.FLAG_HANDLES_MEDIA_BUTTONS | MediaSession.FLAG_HANDLES_TRANSPORT_CONTROLS);

            PlaybackState state = new PlaybackState.Builder()
                .setActions(
                    PlaybackState.ACTION_PLAY |
                    PlaybackState.ACTION_PAUSE |
                    PlaybackState.ACTION_PLAY_PAUSE |
                    PlaybackState.ACTION_STOP
                )
                .setState(PlaybackState.STATE_PLAYING, PlaybackState.PLAYBACK_POSITION_UNKNOWN, 1.0f)
                .build();
            mediaSession.setPlaybackState(state);

            mediaSession.setCallback(new MediaSession.Callback() {
                @Override
                public void onPlay() {
                    MainActivity.sendPlayerCommand("playVideo");
                }

                @Override
                public void onPause() {
                    MainActivity.sendPlayerCommand("pauseVideo");
                }

                @Override
                public void onStop() {
                    MainActivity.sendPlayerCommand("stopVideo");
                    stopSelf();
                }
            });

            mediaSession.setActive(true);
        } catch (Exception e) {
            e.printStackTrace();
        }

        createNotificationChannel();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "PlayTube Background Playback",
                NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Keeps video & audio streaming when the screen is locked");
            channel.setShowBadge(false);
            channel.setSound(null, null);
            channel.enableVibration(false);
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            String action = intent.getAction();
            if (ACTION_STOP.equals(action)) {
                if (mediaSession != null) {
                    mediaSession.setActive(false);
                }
                stopForeground(true);
                stopSelf();
                return START_NOT_STICKY;
            } else if (ACTION_PLAY.equals(action)) {
                MainActivity.sendPlayerCommand("playVideo");
                return START_STICKY;
            } else if (ACTION_PAUSE.equals(action)) {
                MainActivity.sendPlayerCommand("pauseVideo");
                return START_STICKY;
            }
        }

        String title = (intent != null && intent.hasExtra(EXTRA_TITLE))
            ? intent.getStringExtra(EXTRA_TITLE)
            : "PlayTube Stream";
        String artist = (intent != null && intent.hasExtra(EXTRA_ARTIST))
            ? intent.getStringExtra(EXTRA_ARTIST)
            : "Playing in background (Screen-off enabled)";

        Intent openAppIntent = new Intent(this, MainActivity.class);
        openAppIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            this,
            0,
            openAppIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0)
        );

        Notification notification;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder builder = new Notification.Builder(this, CHANNEL_ID)
                .setContentTitle(title)
                .setContentText(artist)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(pendingIntent)
                .setOngoing(true)
                .setVisibility(Notification.VISIBILITY_PUBLIC)
                .setCategory(Notification.CATEGORY_SERVICE);

            if (mediaSession != null) {
                builder.setStyle(new Notification.MediaStyle().setMediaSession(mediaSession.getSessionToken()));
            }

            notification = builder.build();
        } else {
            Notification.Builder builder = new Notification.Builder(this)
                .setContentTitle(title)
                .setContentText(artist)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(pendingIntent)
                .setOngoing(true)
                .setPriority(Notification.PRIORITY_LOW);

            if (mediaSession != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                builder.setStyle(new Notification.MediaStyle().setMediaSession(mediaSession.getSessionToken()));
            }

            notification = builder.build();
        }

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
            } else {
                startForeground(NOTIFICATION_ID, notification);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        try {
            if (wakeLock != null && wakeLock.isHeld()) {
                wakeLock.release();
            }
            if (mediaSession != null) {
                mediaSession.setActive(false);
                mediaSession.release();
                mediaSession = null;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
