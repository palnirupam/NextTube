package com.playtube.streamer;

import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.PowerManager;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.FrameLayout;
import androidx.core.content.ContextCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebChromeClient;

public class MainActivity extends BridgeActivity {
    private View customView;
    private WebChromeClient.CustomViewCallback customViewCallback;
    private FrameLayout fullscreenContainer;
    private PowerManager.WakeLock wakeLock;
    private AudioManager audioManager;
    private String currentVideoTitle = "PlayTube Stream";
    private String currentChannelName = "Playing in background";
    private boolean isPlaying = false;
    private final Handler handler = new Handler(Looper.getMainLooper());

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initialize WakeLock to prevent CPU sleep when screen is locked
        try {
            PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
            if (pm != null) {
                wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "PlayTube:ActivityWakeLock");
            }
            audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
            requestAudioFocus();
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Hardware-accelerated media streaming & WebView configuration
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                WebSettings settings = webView.getSettings();
                settings.setMediaPlaybackRequiresUserGesture(false);
                settings.setJavaScriptEnabled(true);
                settings.setDomStorageEnabled(true);
                settings.setDatabaseEnabled(true);
                settings.setAllowFileAccess(true);
                settings.setAllowContentAccess(true);
                settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

                // Force Desktop Chrome User-Agent to unlock 1080p, 1440p, and 4K maximum bitrate streams
                String desktopUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
                settings.setUserAgentString(desktopUserAgent);
                settings.setUseWideViewPort(true);
                settings.setLoadWithOverviewMode(true);

                // Expose native bridge for seamless background & lock screen media sync
                webView.addJavascriptInterface(new PlayTubeNativeInterface(), "PlayTubeNative");

                // Enable Fullscreen Video Support in WebView with auto landscape rotation
                webView.setWebChromeClient(new BridgeWebChromeClient(getBridge()) {
                    @Override
                    public void onShowCustomView(View view, CustomViewCallback callback) {
                        if (customView != null) {
                            callback.onCustomViewHidden();
                            return;
                        }

                        customView = view;
                        customViewCallback = callback;

                        // Create fullscreen overlay container
                        ViewGroup decorView = (ViewGroup) getWindow().getDecorView();
                        fullscreenContainer = new FrameLayout(MainActivity.this);
                        fullscreenContainer.setBackgroundColor(android.graphics.Color.BLACK);
                        fullscreenContainer.setLayoutParams(new FrameLayout.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT
                        ));
                        fullscreenContainer.addView(view, new FrameLayout.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT
                        ));
                        decorView.addView(fullscreenContainer);

                        // Rotate to Landscape for immersive full screen video playback
                        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);

                        // Hide System UI (Immersive Fullscreen)
                        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
                        if (controller != null) {
                            controller.hide(WindowInsetsCompat.Type.systemBars());
                            controller.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
                        }
                    }

                    @Override
                    public void onHideCustomView() {
                        if (customView == null) return;

                        ViewGroup decorView = (ViewGroup) getWindow().getDecorView();
                        if (fullscreenContainer != null) {
                            fullscreenContainer.removeView(customView);
                            decorView.removeView(fullscreenContainer);
                            fullscreenContainer = null;
                        }

                        if (customViewCallback != null) {
                            customViewCallback.onCustomViewHidden();
                            customViewCallback = null;
                        }
                        customView = null;

                        // Restore orientation to Portrait
                        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

                        // Restore System UI
                        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
                        if (controller != null) {
                            controller.show(WindowInsetsCompat.Type.systemBars());
                        }
                    }
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void requestAudioFocus() {
        if (audioManager == null) return;
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                AudioAttributes attributes = new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                    .build();
                AudioFocusRequest focusRequest = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN)
                    .setAudioAttributes(attributes)
                    .build();
                audioManager.requestAudioFocus(focusRequest);
            } else {
                audioManager.requestAudioFocus(null, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN);
            }
        } catch (Exception ignored) {}
    }

    public class PlayTubeNativeInterface {
        @JavascriptInterface
        public void onVideoStarted(String title, String channel) {
            isPlaying = true;
            if (title != null && !title.isEmpty()) currentVideoTitle = title;
            if (channel != null && !channel.isEmpty()) currentChannelName = channel;
            runOnUiThread(() -> startPlaybackService());
        }

        @JavascriptInterface
        public void onVideoPaused() {
            // Keep service ready or active
        }

        @JavascriptInterface
        public void onVideoStopped() {
            isPlaying = false;
            runOnUiThread(() -> stopPlaybackService());
        }

        @JavascriptInterface
        public void setFullscreen(boolean fullscreen) {
            runOnUiThread(() -> {
                if (fullscreen) {
                    setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
                    WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
                    if (controller != null) {
                        controller.hide(WindowInsetsCompat.Type.systemBars());
                        controller.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
                    }
                } else {
                    setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
                    WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
                    if (controller != null) {
                        controller.show(WindowInsetsCompat.Type.systemBars());
                    }
                }
            });
        }
    }

    public void startPlaybackService() {
        try {
            Intent intent = new Intent(this, MediaPlaybackService.class);
            intent.setAction(MediaPlaybackService.ACTION_START);
            intent.putExtra(MediaPlaybackService.EXTRA_TITLE, currentVideoTitle);
            intent.putExtra(MediaPlaybackService.EXTRA_ARTIST, currentChannelName + " • Screen-off Playback Active");
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                ContextCompat.startForegroundService(this, intent);
            } else {
                startService(intent);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void stopPlaybackService() {
        try {
            Intent intent = new Intent(this, MediaPlaybackService.class);
            intent.setAction(MediaPlaybackService.ACTION_STOP);
            startService(intent);
        } catch (Exception ignored) {}
    }

    @Override
    public void onBackPressed() {
        if (customView != null) {
            WebChromeClient client = getBridge().getWebView().getWebChromeClient();
            if (client != null) {
                client.onHideCustomView();
            }
            return;
        }
        super.onBackPressed();
    }

    @Override
    public void onPause() {
        super.onPause();
        keepAudioPlaying();
    }

    @Override
    public void onStop() {
        super.onStop();
        keepAudioPlaying();
    }

    @Override
    public void onResume() {
        super.onResume();
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                webView.onResume();
                webView.resumeTimers();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void keepAudioPlaying() {
        try {
            if (wakeLock != null && !wakeLock.isHeld()) {
                wakeLock.acquire(45 * 60 * 1000L); // Keep CPU awake for 45 mins
            }
            if (isPlaying) {
                startPlaybackService();
            }

            WebView webView = getBridge().getWebView();
            if (webView != null) {
                // Prevent WebView from freezing timers & HTML5 audio
                webView.onResume();
                webView.resumeTimers();

                // Force YouTube iframe to resume playing when the screen is locked
                handler.postDelayed(() -> {
                    try {
                        webView.evaluateJavascript(
                            "(function() {" +
                            "  var iframes = document.querySelectorAll('iframe');" +
                            "  iframes.forEach(function(f) {" +
                            "    try { f.contentWindow.postMessage('{\"event\":\"command\",\"func\":\"playVideo\",\"args\":\"\"}', '*'); } catch(e){}" +
                            "  });" +
                            "})();",
                            null
                        );
                    } catch (Exception ignored) {}
                }, 200);

                handler.postDelayed(() -> {
                    try {
                        webView.evaluateJavascript(
                            "(function() {" +
                            "  var iframes = document.querySelectorAll('iframe');" +
                            "  iframes.forEach(function(f) {" +
                            "    try { f.contentWindow.postMessage('{\"event\":\"command\",\"func\":\"playVideo\",\"args\":\"\"}', '*'); } catch(e){}" +
                            "  });" +
                            "})();",
                            null
                        );
                    } catch (Exception ignored) {}
                }, 600);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onDestroy() {
        try {
            if (wakeLock != null && wakeLock.isHeld()) {
                wakeLock.release();
            }
            stopPlaybackService();
        } catch (Exception ignored) {}
        super.onDestroy();
    }
}
