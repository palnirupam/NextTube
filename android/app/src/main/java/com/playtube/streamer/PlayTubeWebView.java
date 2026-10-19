package com.playtube.streamer;

import android.content.Context;
import android.util.AttributeSet;
import android.view.View;
import com.getcapacitor.CapacitorWebView;

public class PlayTubeWebView extends CapacitorWebView {

    public PlayTubeWebView(Context context) {
        super(context, null);
    }

    public PlayTubeWebView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected void onWindowVisibilityChanged(int visibility) {
        // Trick Chromium WebView into reporting View.VISIBLE at all times,
        // preventing media pipeline teardown and audio pausing when the screen is locked.
        if (visibility == View.GONE || visibility == View.INVISIBLE) {
            super.onWindowVisibilityChanged(View.VISIBLE);
        } else {
            super.onWindowVisibilityChanged(visibility);
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasWindowFocus) {
        super.onWindowFocusChanged(true);
    }

    @Override
    protected void onVisibilityChanged(View changedView, int visibility) {
        super.onVisibilityChanged(changedView, View.VISIBLE);
    }

    @Override
    public void dispatchWindowVisibilityChanged(int visibility) {
        super.dispatchWindowVisibilityChanged(View.VISIBLE);
    }

    @Override
    public void dispatchWindowFocusChanged(boolean hasFocus) {
        super.dispatchWindowFocusChanged(true);
    }

    @Override
    public void onPause() {
        // Suppress onPause to prevent Chromium from pausing HTML5 audio/video when screen is turned off
    }

    public void forceActualPause() {
        super.onPause();
    }
}
