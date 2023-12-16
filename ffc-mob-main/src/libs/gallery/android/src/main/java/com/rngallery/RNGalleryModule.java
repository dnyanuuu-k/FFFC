package com.rngallery;

import android.view.View;
// import android.graphics.Color;
import android.widget.ImageView;
import android.util.Log;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.uimanager.util.ReactFindViewUtil;

import java.util.ArrayList;
import java.util.List;

import com.bumptech.glide.Glide;
import com.stfalcon.imageviewer.listeners.OnImageChangeListener;
import com.stfalcon.imageviewer.StfalconImageViewer;
import com.stfalcon.imageviewer.loader.ImageLoader;

public class RNGalleryModule extends ReactContextBaseJavaModule {
  private final static String TAG = "RNGallery";
  private final ReactApplicationContext reactContext;
  private StfalconImageViewer.Builder stfalconImageViewer;
  private StfalconImageViewer viewerBuild;  
  private ImageLoader<ReadableMap> imageLoader;
  private View rootView;

  public RNGalleryModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return TAG;
  }

  // Helper Functions
  private ImageLoader<ReadableMap> getImageLoader () {
    if(this.imageLoader == null){
      final ReactApplicationContext reactContext = this.reactContext;
      this.imageLoader = new ImageLoader<ReadableMap>() {
          @Override
          public void loadImage(ImageView imageView, ReadableMap image) {
            UiThreadUtil.runOnUiThread(new Thread(new Runnable() {
              public void run() {              
                Double ratio = image.getDouble("ratio");
                Double width = 32.0;
                Double height = width / ratio;
                Bitmap placeholderBitmap = BlurHashDecoder.INSTANCE.decode(image.getString("hash"), 32, height.intValue(), 1f, true);
                BitmapDrawable placeholder = new BitmapDrawable(reactContext.getResources(), placeholderBitmap);
                Glide.with(reactContext)                      
                      .load(image.getString("url"))
                      .placeholder(placeholder)
                      .into(imageView);
                }
            }));              
          }
      };
    }    
    return this.imageLoader;
  }

  private ImageView getRNImageView(int index) {    
    if(rootView == null) {
      rootView = getCurrentActivity().getWindow().getDecorView().getRootView();      
    }
    if (rootView == null) {
      return null;
    }
    ImageView requiredView = (ImageView) ReactFindViewUtil.findView(rootView, "stf" + index);
    return requiredView;
  }

  private void updateTransitionImage(ImageView imageView) {
    if (imageView == null) {
      return;
    }
    if(viewerBuild != null){
      viewerBuild.updateTransitionImage(imageView);
    }
  }

  // React Functions

  @ReactMethod
  public void setPhotos(ReadableArray photos) {
    List<ReadableMap> images = new ArrayList<>();    
    for(int i = 0; i < photos.size(); i++) {
      if(photos.getType(i) == ReadableType.Map) {
        ReadableMap photo = photos.getMap(i);
        images.add(photo);
      }      
    }
    UiThreadUtil.runOnUiThread(new Thread(new Runnable() {
      public void run() {
        stfalconImageViewer = new StfalconImageViewer          
          .Builder<>(getCurrentActivity(), images, getImageLoader())
          .withHiddenStatusBar(false);
      }
    }));
  }

  @ReactMethod
  public void showPhotos(int index, Promise promise) {
    if(stfalconImageViewer == null){
      promise.reject("Please set photos first");
      return;
    }
    stfalconImageViewer.withStartPosition(index);
    UiThreadUtil.runOnUiThread(new Thread(new Runnable() {
      public void run() {        
        ImageView requiredView = getRNImageView(index);
        if(requiredView != null) {
          stfalconImageViewer.withTransitionFrom(requiredView);
        };
        viewerBuild = stfalconImageViewer.withImageChangeListener(new OnImageChangeListener() {
          @Override
          public void onImageChange(int position) {
            ImageView requiredView = getRNImageView(position);
            if(requiredView != null) {
              updateTransitionImage(requiredView);              
            }
          }
        }).show();
      }
    }));
    promise.resolve(true);
  }

  @ReactMethod
  public void clearPhotos() {
    stfalconImageViewer = null;
    imageLoader = null;
    viewerBuild = null;
  }

}