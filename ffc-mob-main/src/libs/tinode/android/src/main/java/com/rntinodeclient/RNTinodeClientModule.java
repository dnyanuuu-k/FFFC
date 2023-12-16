package com.rntinodeclient;

import android.content.SharedPreferences;
import android.text.format.DateUtils;
import android.text.TextUtils;
import android.content.Context;
import android.database.Cursor;
import android.util.Log;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.app.LoaderManager;
import android.content.Loader;

import androidx.appcompat.app.AppCompatActivity;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.Date;
import java.util.Arrays;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.locks.ReentrantLock;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.atomic.AtomicBoolean;
import java.lang.ref.WeakReference;


import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

// import com.rntinodeclient.account.Utils;
import co.tinode.tinodesdk.AlreadySubscribedException;
import co.tinode.tinodesdk.PromisedReply;
import co.tinode.tinodesdk.Tinode;
import co.tinode.tinodesdk.model.AuthScheme;
import co.tinode.tinodesdk.model.ServerMessage;
import co.tinode.tinodesdk.ComTopic;
import co.tinode.tinodesdk.Storage;
import com.rntinodeclient.media.VxCard;
import com.rntinodeclient.db.BaseDb;
import com.rntinodeclient.db.MessageDb;
import com.rntinodeclient.db.StoredMessage;
import co.tinode.tinodesdk.MeTopic;
import co.tinode.tinodesdk.NotConnectedException;
import co.tinode.tinodesdk.ServerResponseException;
import co.tinode.tinodesdk.Topic;
import co.tinode.tinodesdk.model.Acs;
import co.tinode.tinodesdk.model.Credential;
import co.tinode.tinodesdk.model.PrivateType;
import co.tinode.tinodesdk.model.Description;
import co.tinode.tinodesdk.model.MsgServerData;
import co.tinode.tinodesdk.model.MsgServerInfo;
import co.tinode.tinodesdk.model.MsgServerPres;
import co.tinode.tinodesdk.model.Subscription;
import co.tinode.tinodesdk.model.Drafty;

public class RNTinodeClientModule extends ReactContextBaseJavaModule {
    private static final String TAG = "RNTinodeClient";

    // Connection Constants    
    private static final int MAX_MESSAGE_PREVIEW_LENGTH = 60;
    private static final String ON_CONNECTION_CHANGE = "connectionChange";
    private static final String ON_CONVERSATION_CHANGE = "conversationChange";
    private static final String ON_USERDATA_CHANGE = "userDataChange";
    private static final String ON_SUBSCRIPTION_ERROR = "onSubscriptionError";
    private static final String ON_MESSAGE_CHANGE = "onMessageChange";
    private static final String ON_TYPING_STATUS = "onTypingStatus";
    private static final String ON_USER_UPDATE = "onUserUpdate";

    // Chat Screen Constants
    private static final int MESSAGES_QUERY_ID = 200;
    private static final int MESSAGES_TO_LOAD = 20000;
    private static final int READ_DELAY = 1000;

    private static final String HARD_RESET = "hard_reset";
    private static final int REFRESH_NONE = 0;
    private static final int REFRESH_SOFT = 1;
    private static final int REFRESH_HARD = 2;
    // How long a typing indicator should play its animation, milliseconds.
    private static final int TYPING_INDICATOR_DURATION = 4000;

    private static ReactApplicationContext reactContext;

    // The Tinode cache is linked from here so it's never garbage collected.
    @SuppressWarnings({
        "FieldCanBeLocal",
        "unused"
    })
    private static Cache sCache;
    private static Boolean listenToConnectedStatus = false;

    private ContactsEventListener contactTinodeListener = null;
    private MessageEventListener messageTinodeListener = null;
    private MeListener mMeTopicListener = null;
    private MeTopic < VxCard > mMeTopic = null;


    // Chat Screen Contants
    private MessageLoaderCallbacks mMessageLoaderCallback;
    private PausableSingleThreadExecutor mMessageSender = null;
    private String mTopicName = null;
    private ComTopic<VxCard> mTopic = null;
    private Handler mNoteReadHandler = null;
    private boolean mSendTypingNotifications = true;
    private boolean mSendReadReceipts = true;
    private Cursor mCursor = null;

    public RNTinodeClientModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    public static Context getAppContext() {
        return (Context) reactContext;
    }

    public static void retainCache(Cache cache) {
        sCache = cache;
    }

    @Override
    public String getName() {
        return TAG;
    }

    @ReactMethod
    public void initClient() {
        mMeTopic = Cache.getTinode().getOrCreateMeTopic();
        mMeTopicListener = new MeListener();
    }

    @ReactMethod
    public void isAuthenticated(Promise promise) {
        boolean isAuthenticated = Cache.getTinode().isAuthenticated();
        promise.resolve(isAuthenticated);
    }

    @ReactMethod
    public void logout() {
        Cache.getTinode().logout();
    }

    @ReactMethod
    public void invalidate() {
        Cache.invalidate();
    }

    @ReactMethod
    public void readMessages() {
        sendNoteRead(0);
    }

    @ReactMethod
    public void sendTyping() {
        if(mTopic != null) {
            mTopic.noteKeyPress();
        }        
    }

    @ReactMethod
    public void login(String hostname, String login, String password, Callback callback) {
        boolean tls = false;
        final Tinode tinode = Cache.getTinode();
        // This is called on the websocket thread.
        tinode.connect(hostname, tls, false)
            .thenApply(new PromisedReply.SuccessListener < ServerMessage > () {
                @Override
                public PromisedReply < ServerMessage > onSuccess(ServerMessage ignored) {
                    return tinode.loginBasic(login, password);
                }
            })
            .thenApply(
                new PromisedReply.SuccessListener < ServerMessage > () {
                    @Override
                    public PromisedReply < ServerMessage > onSuccess(final ServerMessage msg) {
                        // sharedPref.edit().putString(LoginActivity.PREFS_LAST_LOGIN, login).apply();

                        // UiUtils.updateAndroidAccount(parent, tinode.getMyId(),
                        //         AuthScheme.basicInstance(login, password).toString(),
                        //         tinode.getAuthToken(), tinode.getAuthTokenExpiration());

                        // msg could be null if earlier login has succeeded.
                        if (msg != null && msg.ctrl.code >= 300 && msg.ctrl.text.contains("validate credentials")) {
                            callback.invoke(null, msg.ctrl.text);
                        } else {
                            tinode.setAutoLoginToken(tinode.getAuthToken());
                            // Force immediate sync, otherwise Contacts tab may be unusable.
                            // UiUtils.onLoginSuccess(parent, signIn, tinode.getMyId());
                            callback.invoke(tinode.getMyId(), null);
                        }
                        return null;
                    }
                })
            .thenCatch(
                new PromisedReply.FailureListener <ServerMessage> () {
                    @Override
                    public PromisedReply <ServerMessage> onFailure(Exception err) {
                        callback.invoke(null, err.getMessage());
                        return null;
                    }
                });
    }

    static boolean attachMeTopic(final MeEventListener l) {
        Tinode tinode = Cache.getTinode();
        if (!tinode.isAuthenticated()) {
            // If connection is not ready, wait for completion. This method will be called again
            // from the onLogin callback;
            Cache.getTinode().reconnectNow(true, false, false);
            return false;
        }

        // If connection exists attachMeTopic returns resolved promise.
        Cache.attachMeTopic(l).thenCatch(new PromisedReply.FailureListener < ServerMessage > () {
            @Override
            public PromisedReply < ServerMessage > onFailure(Exception err) {
                l.onSubscriptionError(err);
                if (err instanceof ServerResponseException) {
                    ServerResponseException sre = (ServerResponseException) err;
                    int errCode = sre.getCode();
                    // 401: attempt to subscribe to 'me' happened before login, do not log out.
                    // 403: Does not apply to 'me' subscription.
                    if (errCode == 404) {
                        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(ON_SUBSCRIPTION_ERROR, err.getMessage());
                    } else if (errCode == 502 && "cluster unreachable".equals(sre.getMessage())) {
                        // Must reset connection.
                        Cache.getTinode().reconnectNow(false, true, false);
                    }
                }
                return null;
            }
        });

        return true;
    }

    public WritableArray getConversations() {
        WritableArray conversations = new WritableNativeArray();
        final Collection <ComTopic<VxCard>> newTopics = Cache.getTinode().getFilteredTopics(t ->
            t.getTopicType().match(ComTopic.TopicType.USER));

        for (ComTopic < VxCard > topic: newTopics) {
            WritableMap conversation = Arguments.createMap();
            Storage.Message msg = Cache.getTinode().getLastMessage(topic.getName());
            VxCard pub = topic.getPub();
            if (pub != null && pub.fn != null) {
                conversation.putString("name", pub.fn);
            } else {
                conversation.putString("name", "FilmFestBook User");
            }

            Drafty content = msg != null ? msg.getContent() : null;
            if (content != null) {
                if (msg.isMine()) {
                    if (msg.getStatus() <= BaseDb.Status.SENDING.value) {
                        conversation.putString("delivery", "pending");
                    } else if (msg.getStatus() == BaseDb.Status.FAILED.value) {
                        conversation.putString("delivery", "warn");
                    } else {
                        if (topic.msgReadCount(msg.getSeqId()) > 0) {
                            conversation.putString("delivery", "sent_read");
                        } else if (topic.msgRecvCount(msg.getSeqId()) > 0) {
                            conversation.putString("delivery", "sent_got");
                        } else {
                            conversation.putString("delivery", "sent");
                        }
                    }
                }
                conversation.putString("previewText",
                    content.preview(MAX_MESSAGE_PREVIEW_LENGTH).toString()
                );
            } else {
                conversation.putString("previewText", topic.getComment());
            }
            conversation.putInt("unreadCount", topic.getUnreadCount());
            conversation.putBoolean("online", topic.getOnline());
            conversation.putString("lastseen", relativeDateFormat(topic.getLastSeen()));            

            conversation.putBoolean("muted", topic.isMuted());
            conversation.putBoolean("blocked", topic.isJoiner());
            conversation.putString("topic", topic.getName());

            conversations.pushMap(conversation);
        }

        return conversations;
    }

    @ReactMethod
    public void getConversationList(Callback callback) {
        callback.invoke(getConversations());
    }
    // Conversation Listeners

    @ReactMethod
    public void startMeListener() {
        final Tinode tinode = Cache.getTinode();
        contactTinodeListener = new ContactsEventListener(tinode.isConnected());
        tinode.addListener(contactTinodeListener);
        Cache.setSelectedTopicName(null);
        attachMeTopic(mMeTopicListener);
    }

    @ReactMethod
    public void pauseMeListener() {
        Cache.getTinode().removeListener(contactTinodeListener);
    }

    @ReactMethod
    public void stopMeListener() {
        if (mMeTopic != null) {
            mMeTopic.setListener(null);
        }
    }

    @ReactMethod
    public void setConnectionListener(boolean status) {
        listenToConnectedStatus = status;
    }

    static void setConnectedStatus(Boolean isConnected) {
        if (listenToConnectedStatus) {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(ON_CONNECTION_CHANGE, isConnected);
        }
    }

    public void datasetChanged() {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(ON_CONVERSATION_CHANGE, getConversations());
    }

    public void onUserDataChange() {
        if (listenToConnectedStatus) {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(ON_USERDATA_CHANGE, "changed");
        }
    }

    static class MeEventListener extends MeTopic.MeListener < VxCard > {
        // Called on failed subscription request.
        public void onSubscriptionError(Exception ex) {

        }
    }

    static class EventListener implements Tinode.EventListener {
        private Boolean mConnected;

        EventListener(Boolean connected) {
            super();
            mConnected = connected;
            setConnectedStatus(connected);
        }

        @Override
        public void onConnect(int code, String reason, Map < String, Object > params) {
            // Show that we are connected
            setConnectedStatus(true);
        }

        @Override
        public void onDisconnect(boolean byServer, int code, String reason) {
            // Show that we are disconnected
            if (code <= 0) {
                // Log.d(TAG, "Network error");
            } else {
                // Log.d(TAG, "onDisconnect error: " + code);
            }
            setConnectedStatus(false);
        }
    }

    // This is called on Websocket thread.
    private class MeListener extends MeEventListener {

        @Override
        public void onInfo(MsgServerInfo info) {
            datasetChanged();
        }

        @Override
        public void onPres(MsgServerPres pres) {
            if ("msg".equals(pres.what)) {
                datasetChanged();
            } else if ("off".equals(pres.what) || "on".equals(pres.what)) {
                datasetChanged();
            }
        }

        @Override
        public void onMetaSub(final Subscription <VxCard, PrivateType> sub) {
            if (sub.deleted == null) {
                onUserDataChange();
            }
        }

        @Override
        public void onMetaDesc(final Description <VxCard, PrivateType> desc) {
            // if (desc.pub != null) {
            //     desc.pub.constructBitmap();
            // }
            onUserDataChange();
        }

        @Override
        public void onSubsUpdated() {
            datasetChanged();
        }

        @Override
        public void onSubscriptionError(Exception ex) {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(ON_SUBSCRIPTION_ERROR, ex.getMessage());
        }

        @Override
        public void onContUpdated(final String contact) {
            datasetChanged();
        }

        @Override
        public void onMetaTags(String[] tags) {
            onUserDataChange();
        }

        @Override
        public void onCredUpdated(Credential[] cred) {
            onUserDataChange();
        }
    }

    private class ContactsEventListener extends EventListener {
        ContactsEventListener(boolean online) {
            super(online);
        }

        @Override
        public void onLogin(int code, String txt) {
            super.onLogin(code, txt);
            attachMeTopic(mMeTopicListener);
        }

        @Override
        public void onDisconnect(boolean byServer, int code, String reason) {
            super.onDisconnect(byServer, code, reason);

            // Update online status of contacts.
            datasetChanged();
        }
    }

    // Chat Screen Functions & Listeners

    // Try to send all pending messages.
    public void syncAllMessages(final boolean runLoader) {
        syncMessages(-1, runLoader);
    }

    // Try to send the specified message.
    public void syncMessages(final long msgId, final boolean runLoader) {
        Log.w(TAG, "Sync Messages Sync Start");
        mMessageSender.submit(() -> {
            PromisedReply<ServerMessage> promise;
            if (msgId > 0) {
                promise = mTopic.syncOne(msgId);
            } else {
                promise = mTopic.syncAll();
            }
            if (runLoader) {
                promise.thenApply(new PromisedReply.SuccessListener<ServerMessage>() {
                    @Override
                    public PromisedReply<ServerMessage> onSuccess(ServerMessage result) {
                        Log.w(TAG, "Sync Done");
                        runMessagesLoader();
                        return null;
                    }
                });
            }
            promise.thenCatch(new PromisedReply.FailureListener<ServerMessage>() {
                @Override
                public PromisedReply<ServerMessage> onFailure(Exception err) {
                    Log.w(TAG, "Sync failed", err);
                    return null;
                }
            });
        });
    }

    void setTypingStatus (boolean isTyping) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(ON_TYPING_STATUS, isTyping);
    }

    @NonNull
    private static String relativeDateFormat(Date then) {
        if (then == null) {
            return "Never";
        }
        long thenMillis = then.getTime();
        if (thenMillis == 0) {
            return "Never";
        }
        long nowMillis = System.currentTimeMillis();
        if (nowMillis - thenMillis < DateUtils.MINUTE_IN_MILLIS) {
            return "Just now";
        }

        return DateUtils.getRelativeTimeSpanString(thenMillis, nowMillis,
                DateUtils.MINUTE_IN_MILLIS,
                DateUtils.FORMAT_ABBREV_ALL).toString();
    }

    void updateUserChatMeta(){        
        if(mTopic != null){
            WritableMap userData = Arguments.createMap();
            VxCard pub = mTopic.getPub();
            if (pub != null) {
                userData.putString("name", pub.fn);
            }
            userData.putString("topic", mTopic.getName());
            userData.putBoolean("isOnline", mTopic.getOnline());
            userData.putString("lastseen", relativeDateFormat(mTopic.getLastSeen()));
            userData.putBoolean("isDeleted", mTopic.isDeleted());
            reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(ON_USER_UPDATE, userData);

            Log.w(TAG, "User Data Change");
        }        
    }

    // Schedule a delayed {note what="read"} notification.
    void sendNoteRead(int seq) {
        if (mSendReadReceipts && mNoteReadHandler != null) {
            Message msg = mNoteReadHandler.obtainMessage(0, seq, 0, mTopicName);
            mNoteReadHandler.sendMessageDelayed(msg, READ_DELAY);
        }
    }

    boolean sendMessage(Drafty content, int seq, boolean isReplacement) {
        if (mTopic != null) {
            Map<String,Object> head = seq > 0 ?
                    (isReplacement ? Tinode.headersForReplacement(seq) :
                            Tinode.headersForReply(seq)) :
                    null;
            PromisedReply<ServerMessage> done = mTopic.publish(content, head);
            BaseDb.getInstance().getStore().msgPruneFailed(mTopic);
            runMessagesLoader(); // Refreshes the messages: hides removed, shows pending.
            done.thenApply(new PromisedReply.SuccessListener<ServerMessage>() {
                @Override
                public PromisedReply<ServerMessage> onSuccess(ServerMessage result) {
                    Log.w(TAG, "Message Sent");
                    return null;
                }
            })
            .thenCatch(new PromisedReply.FailureListener <ServerMessage> () {
                @Override
                public PromisedReply <ServerMessage> onFailure(Exception err) {
                    Log.w(TAG, err.getMessage());
                    return null;
                }
            })
            .thenFinally(new PromisedReply.FinalListener() {
                @Override
                public void onFinally() {
                    Log.w(TAG, "Message delivered");
                    // Updates message list with "delivered" or "failed" icon.
                    runMessagesLoader();
                }
            });
            return true;
        }
        return false;
    }


    // Handler which sends "read" notifications for received messages.
    private static class NoteHandler extends Handler {
        final WeakReference <RNTinodeClientModule> ref;

        NoteHandler(RNTinodeClientModule activity) {
            super(Looper.getMainLooper());
            ref = new WeakReference <> (activity);
        }

        @Override
        public void handleMessage(@NonNull Message msg) {
            RNTinodeClientModule activity = ref.get();
            if (activity == null) {
                return;
            }

            if (activity.mTopic == null) {
                return;
            }

            // // If messages fragment is not visible don't send the notification.
            // if (!activity.isFragmentVisible(FRAGMENT_MESSAGES)) {
            //     return;
            // }

            // Don't send a notification if more notifications are pending. This avoids the case of acking
            // every {data} message in a large batch.
            // It may pose a problem if a later message is acked first (msg[1].seq > msg[2].seq), but that
            // should not happen.
            // if (hasMessages(0)) {
                // return;
            // }

            String topicName = (String) msg.obj;
            if (topicName.equals(activity.mTopic.getName())) {
                activity.mTopic.noteRead(msg.arg1);
            }
        }
    }

    private void topicAttach(boolean interactive) {
        Log.w(TAG, "Topic is Called");
        if (!Cache.getTinode().isAuthenticated()) {
            // If connection is not ready, wait for completion. This method will be called again
            // from the onLogin callback;
            Log.w(TAG, "Tinode is not Authenticated");
            return;
        }

        Log.w(TAG, "topicAttach is starting");

        // setRefreshing(true);
        Topic.MetaGetBuilder builder = mTopic.getMetaGetBuilder()
            .withDesc()
            .withSub()
            .withLaterData(MESSAGES_TO_LOAD)
            .withDel();

        Log.w(TAG, "builder set");

        if (mTopic.isOwner()) {
            builder = builder.withTags();
        }

        if (mTopic.isDeleted()) {
            Log.w(TAG, "topic is deleted");
            // setRefreshing(false);
            // UiUtils.setupToolbar(this, mTopic.getPub(), mTopicName, false, null, true);
            // maybeShowMessagesFragmentOnAttach();
            return;
        }
        Log.w(TAG, "Subscribed");
        mTopic.subscribe(null, builder.build())
            .thenApply(new PromisedReply.SuccessListener < ServerMessage > () {
                @Override
                public PromisedReply < ServerMessage > onSuccess(ServerMessage result) {
                    Log.w(TAG, "Server result " + result.ctrl.code);
                    if (result.ctrl != null && result.ctrl.code == 303) {
                        // Redirect.
                        changeTopic(result.ctrl.getStringParam("topic", null), false);
                        return null;
                    }
                    updateUserChatMeta();
                    // Submit pending messages for processing: publish queued,
                    // delete marked for deletion.
                    Log.w(TAG, "Subscribed");
                    syncAllMessages(true);
                    return null;
                }
            })
            .thenCatch(new PromisedReply.FailureListener <ServerMessage> () {
                @Override
                public PromisedReply <ServerMessage> onFailure(Exception err) {
                    if (!(err instanceof NotConnectedException) && !(err instanceof AlreadySubscribedException)) {
                        Log.w(TAG, "Subscribe failed", err);
                        if (err instanceof ServerResponseException) {
                            int code = ((ServerResponseException) err).getCode();
                            if (code == 404) {
                                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(ON_SUBSCRIPTION_ERROR, err.getMessage());
                                // showFragment(FRAGMENT_INVALID, null, false);
                            }
                        }
                    }
                    return null;
                }
            })
            .thenFinally(new PromisedReply.FinalListener() {
                @Override
                public void onFinally() {
                    // setRefreshing(false);
                    Log.w(TAG, "Finally Done");
                }
            });
    }

    // Topic has changed. Update all the views with the new data.
    // Returns 'true' if topic was successfully changed, false otherwise.
    boolean changeTopic(String topicName, boolean forceReset) {
        if (TextUtils.isEmpty(topicName)) {
            Log.w(TAG, "Failed to switch topics: empty topic name");
            return false;
        }

        // Cancel all pending notifications addressed to the current topic.
        // NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        // if (nm != null) {
        // nm.cancel(topicName, 0);
        // }

        final Tinode tinode = Cache.getTinode();
        ComTopic <VxCard> topic;
        try {
            //noinspection unchecked
            topic = (ComTopic < VxCard > ) tinode.getTopic(topicName);
        } catch (ClassCastException ex) {
            Log.w(TAG, "Failed to switch topics: non-comm topic");
            return false;
        }        

        mTopic = topic;
        boolean changed = false;
        if (mTopicName == null || !mTopicName.equals(topicName)) {
            Cache.setSelectedTopicName(topicName);
            mTopicName = topicName;

            Log.w(TAG, "Topic name is :" + topicName);

            changed = true;

            if (mTopic == null) {
                try {
                    //noinspection unchecked
                    mTopic = (ComTopic < VxCard > ) tinode.newTopic(mTopicName, null);
                } catch (ClassCastException ex) {
                    Log.w(TAG, "New topic is a non-comm topic: " + mTopicName);
                    return false;
                }
            }
        }

        Log.w(TAG, mTopic == null ? "Topic is null" : "Topic Set");

        if (mTopic == null) {
            return false;
        }

        mTopic.setListener(new TListener());

        Log.w(TAG, "TListener is set");

        if (!mTopic.isAttached()) {
            Log.w(TAG, "Topic was not attached");
            // Try immediate reconnect.
            topicAttach(true);
        }else{
            Log.w(TAG, "Topic is now attached");
        }

        // MessagesFragment fragmsg = (MessagesFragment) getSupportFragmentManager().findFragmentByTag(FRAGMENT_MESSAGES);
        // if (fragmsg != null) {
        //     fragmsg.topicChanged(topicName, forceReset || changed);
        // }

        return true;
    }

    void runMessagesLoader() {        
        UiThreadUtil.runOnUiThread(new Thread(new Runnable() {
            public void run() {
              final LoaderManager lm = getCurrentActivity().getLoaderManager();
                final Loader<Cursor> loader = lm.getLoader(MESSAGES_QUERY_ID);
                Bundle args = new Bundle();
                args.putBoolean(HARD_RESET, false);
                if (loader != null && !loader.isReset()) {
                    Log.w(TAG, MESSAGES_QUERY_ID + " Loader Restart");
                    lm.restartLoader(MESSAGES_QUERY_ID, args, mMessageLoaderCallback);
                } else {
                    Log.w(TAG, MESSAGES_QUERY_ID + " Loader Init");
                    lm.initLoader(MESSAGES_QUERY_ID, args, mMessageLoaderCallback);
                }
            }
        }));        
    }

    @ReactMethod
    public void initChatScreen(Promise promise) {
        mMessageSender = new PausableSingleThreadExecutor();
        mMessageSender.pause();
        mNoteReadHandler = new NoteHandler(this);
        mMessageLoaderCallback = new MessageLoaderCallbacks();
        promise.resolve(true);
    }

    @ReactMethod
    public void stopChat(Promise promise) {
        if (mMessageSender != null) {
            mMessageSender.shutdownNow();
        }
        Cache.getTinode().removeListener(messageTinodeListener);
        Cache.setSelectedTopicName(null);
        
        if (mTopic != null) {
            mTopic.setListener(null);
        }

        if (mCursor != null) {
            mCursor.close();
        }

        if (mNoteReadHandler != null) {
            mNoteReadHandler.removeMessages(0);
        }

        mMessageLoaderCallback = null;

        mMessageSender = null;
        mNoteReadHandler = null;
        mTopic = null;
        mCursor = null;
        mTopic = null;
        mTopicName = null;

        promise.resolve(true);
    }

    @ReactMethod
    public void startChat(String topicName, Promise promise) {
        final Tinode tinode = Cache.getTinode();
        messageTinodeListener = new MessageEventListener(tinode.isConnected());
        tinode.addListener(messageTinodeListener);

        // If topic name is not saved, get it from intent, internal or external.
        String currentTopicName = mTopicName;
        if (TextUtils.isEmpty(mTopicName)) {
            currentTopicName = topicName;
        }

        if (!changeTopic(currentTopicName, false)) {
            Cache.setSelectedTopicName(null);
            promise.reject("Unable to change topic");
            return;
        }

        // Resume message sender.
        if (mMessageSender != null) {
            mMessageSender.resume();
        }else{
            promise.reject("mMessageSender is null");
            return;
        }  

        // final SharedPreferences pref = PreferenceManager.getDefaultSharedPreferences(this);

        // mSendReadReceipts = pref.getBoolean(Const.PREF_READ_RCPT, true);
        // mSendTypingNotifications = pref.getBoolean(Const.PREF_TYPING_NOTIF, true);
        promise.resolve(true);

        BaseDb.getInstance().getStore().msgPruneFailed(mTopic);        
    }

    @ReactMethod
    public void sendMessage(String text) {
        Drafty msg = Drafty.parse(text);
        sendMessage(msg, -1, false);
    }

    private static StoredMessage getMessage(Cursor cur, int position) {
        if (cur.moveToPosition(position)) {
            return StoredMessage.readMessage(cur, -1);
        }
        return null;
    }

    public void onChatChange() {
        if (mCursor.moveToFirst()) {
            WritableArray messages = new WritableNativeArray();
            final ComTopic <VxCard> topic = (ComTopic <VxCard>) Cache.getTinode().getTopic(mTopicName);
            do {
                final StoredMessage m = getMessage(mCursor, mCursor.getPosition());
                WritableMap message = Arguments.createMap();
                final Long msgId = m.getDbId();
                boolean hasAttachment = m.content != null && m.content.getEntReferences() != null;
                boolean uploadingAttachment = hasAttachment && m.isPending();
                boolean uploadFailed = hasAttachment && (m.status == BaseDb.Status.FAILED);
                Boolean isFile = m.content != null && m.content.hasEntities(
                    Arrays.asList("AU", "BN", "EX", "HT", "IM", "LN", "MN", "QQ", "VD")
                );

                message.putInt("seqId", m.seq);
                message.putBoolean("isMine", m.isMine());
                message.putDouble("msgId", msgId.doubleValue());
                message.putBoolean("isFile", isFile);
                message.putBoolean("hasAtt", hasAttachment);

                // Normal message.
                if (m.content != null) {
                    message.putString("text", m.content.toString());
                }

                if (hasAttachment) {
                    if (uploadingAttachment) {
                        // cancelUpload(msgId);
                    } else if (uploadFailed) {
                        message.putString("attStatus", "failed");
                    }
                } else {
                    message.putString("attStatus", "none");
                }

                Subscription <VxCard, ? > sub = topic.getSubscription(m.from);
                if (sub != null && sub.pub != null) {
                    message.putString("userName", sub.pub.fn);
                }

                // message.putString("time", relativeDateFormat(m.ts));

                if (m.status.value <= BaseDb.Status.SENDING.value) {
                    message.putString("delivery", "pending");
                } else if (m.status.value == BaseDb.Status.FAILED.value) {
                    message.putString("delivery", "warn");
                } else {
                    if (topic.msgReadCount(m.seq) > 0) {
                        message.putString("delivery", "sent_read");
                    } else if (topic.msgRecvCount(m.seq) > 0) {
                        message.putString("delivery", "sent_got");
                    } else {
                        message.putString("delivery", "sent");
                    }
                }
                messages.pushMap(message);

            } while (mCursor.moveToNext());

            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(ON_MESSAGE_CHANGE, messages);
        }
    }


    private class TListener extends ComTopic.ComListener < VxCard > {

        TListener() {

        }

        @Override
        public void onSubscribe(int code, String text) {
            // Topic name may change after subscription, i.e. new -> grpXXX
            mTopicName = mTopic.getName();
        }

        @Override
        public void onData(MsgServerData data) {
            // Don't send a notification for own messages. They are read by default.
            if (data != null && !Cache.getTinode().isMe(data.from)) {
                sendNoteRead(data.seq);
            }
            // Cancel typing animation.
            setTypingStatus(false);
            runMessagesLoader();
        }

        @Override
        public void onPres(MsgServerPres pres) {
            // noinspection SwitchStatementWithTooFewBranches
            switch (MsgServerPres.parseWhat(pres.what)) {
                case ACS:
                    // runOnUiThread(() -> {
                    //     Fragment fragment = UiUtils.getVisibleFragment(getSupportFragmentManager());
                    //     if (fragment != null) {
                    //         if (fragment instanceof DataSetChangeListener) {
                    //             ((DataSetChangeListener) fragment).notifyDataSetChanged();
                    //         } else if (fragment instanceof MessagesFragment) {
                    //             ((MessagesFragment) fragment).notifyDataSetChanged(true);
                    //         }
                    //     }
                    // });

                    onChatChange();
                    break;
                default:
                    Log.d(TAG, "Topic '" + mTopicName + "' onPres what='" + pres.what + "' (unhandled)");
            }

        }

        @Override
        public void onInfo(MsgServerInfo info) {
            switch (MsgServerInfo.parseWhat(info.what)) {
                case READ:
                case RECV:
                    onChatChange();
                    break;
                case KP:
                    setTypingStatus(true);
                    break;
                default:
                    // Call.
                    break;
            }
        }

        @Override
        public void onSubsUpdated() {
            // Context context = getApplicationContext();
            // if (UiUtils.isPermissionGranted(context, Manifest.permission.WRITE_CONTACTS)) {
            //     Account acc = Utils.getSavedAccount(AccountManager.get(context), Cache.getTinode().getMyId());
            //     if (acc != null) {
            //         ContactsManager.updateContacts(context, acc, Cache.getTinode(), mTopic.getSubscriptions(),
            //             null, false);
            //     }
            // }

            // runOnUiThread(() - > {
            //     Fragment fragment = UiUtils.getVisibleFragment(getSupportFragmentManager());
            //     if (fragment != null) {
            //         if (fragment instanceof DataSetChangeListener) {
            //             ((DataSetChangeListener) fragment).notifyDataSetChanged();
            //         } else if (fragment instanceof MessagesFragment) {
            //             ((MessagesFragment) fragment).notifyDataSetChanged(true);
            //             if (mNewSubsAvailable) {
            //                 mNewSubsAvailable = false;
            //                 // Reload so we can correctly display messages from
            //                 // new users (subscriptions).
            //                 ((MessagesFragment) fragment).notifyDataSetChanged(false);
            //             }
            //         }
            //     }
            // });

            Log.d(TAG, "onSubsUpdated");

        }

        @Override
        public void onMetaDesc(final Description < VxCard, PrivateType > desc) {
            updateUserChatMeta();
        }

        @Override
        public void onMetaSub(Subscription < VxCard, PrivateType > sub) {
            // Not Supporting Group Now
        }

        @Override
        public void onContUpdate(final Subscription < VxCard, PrivateType > sub) {
            // onMetaDesc(null);
        }

        @Override
        public void onMetaTags(String[] tags) {
            // Tags Update Ignore
        }

        @Override
        public void onOnline(final boolean online) {
            updateUserChatMeta();
        }
    }

    private class MessageLoaderCallbacks implements LoaderManager.LoaderCallbacks<Cursor> {

        @NonNull
        @Override
        public Loader <Cursor> onCreateLoader(int id, Bundle args) {
            Log.w(TAG, "onCreateLoader mTopicName : " + mTopicName);
            Log.w(TAG, "onCreateLoader id : " + id);
            if (id == MESSAGES_QUERY_ID && mTopicName != null) {
                int mPagesToLoad = 1;
                Log.w(TAG, "Herr as : " + id);
                try {
                    MessageDb.Loader loader = new MessageDb.Loader(reactContext, mTopicName, mPagesToLoad, MESSAGES_TO_LOAD);
                    Log.w(TAG, "What happned" + loader.init());
                    return loader;
                } catch (Exception e) {
                    Log.w(TAG, e.getMessage());
                    throw new IllegalArgumentException("Unknown loader id " + id);
                }
            }
            throw new IllegalArgumentException("Unknown loader id " + id);
        }

        @Override
        public void onLoadFinished(@NonNull Loader <Cursor> loader,
            Cursor cursor) {
            Log.w(TAG, "Load Finished with ID: " + loader.getId());
            if (loader.getId() == MESSAGES_QUERY_ID) {
                mCursor = cursor;
                onChatChange();
                // cursor.close();

                // swapCursor(cursor, mHardReset ? REFRESH_HARD : REFRESH_SOFT);
            }
        }

        @Override
        public void onLoaderReset(@NonNull Loader <Cursor> loader) {
            Log.w(TAG, "Loader got reset");
            if (loader.getId() == MESSAGES_QUERY_ID) {
                // swapCursor(null, mHardReset ? REFRESH_HARD : REFRESH_SOFT);
                onChatChange();
            }
        }
    }

    private class MessageEventListener extends EventListener {
        MessageEventListener(boolean online) {
            super(online);
        }

        @Override
        public void onLogin(int code, String txt) {
            super.onLogin(code, txt);

            attachMeTopic(null);
            topicAttach(false);
        }
    }

    /**
     * Utility class to send messages queued while offline.
     * The execution is paused while the activity is in background and unpaused
     * when the topic subscription is live.
     */
    private static class PausableSingleThreadExecutor extends ThreadPoolExecutor {
        private final ReentrantLock pauseLock = new ReentrantLock();
        private final Condition unpaused = pauseLock.newCondition();
        private boolean isPaused;

        PausableSingleThreadExecutor() {
            super(1, 1, 0L, TimeUnit.MILLISECONDS, new LinkedBlockingQueue<>());
        }

        @Override
        protected void beforeExecute(Thread t, Runnable r) {
            super.beforeExecute(t, r);
            pauseLock.lock();
            try {
                while (isPaused) unpaused.await();
            } catch (InterruptedException ie) {
                t.interrupt();
            } finally {
                pauseLock.unlock();
            }
        }

        void pause() {
            pauseLock.lock();
            try {
                isPaused = true;
            } finally {
                pauseLock.unlock();
            }
        }

        void resume() {
            pauseLock.lock();
            try {
                isPaused = false;
                unpaused.signalAll();
            } finally {
                pauseLock.unlock();
            }
        }
    }
}