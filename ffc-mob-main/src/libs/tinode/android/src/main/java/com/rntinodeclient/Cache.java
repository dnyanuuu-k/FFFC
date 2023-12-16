package com.rntinodeclient;

import android.os.Build;
import android.util.Log;

// import com.google.firebase.messaging.FirebaseMessaging;

import java.util.Locale;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.rntinodeclient.db.BaseDb;
import com.rntinodeclient.media.VxCard;
// import com.rntinodeclient.services.CallConnection;

import co.tinode.tinodesdk.ComTopic;
import co.tinode.tinodesdk.FndTopic;
import co.tinode.tinodesdk.MeTopic;
import co.tinode.tinodesdk.PromisedReply;
import co.tinode.tinodesdk.Storage;
import co.tinode.tinodesdk.Tinode;
import co.tinode.tinodesdk.model.MsgServerData;
import co.tinode.tinodesdk.model.MsgServerInfo;
import co.tinode.tinodesdk.model.PrivateType;
import co.tinode.tinodesdk.model.ServerMessage;

/**
 * Shared resources.
 */
public class Cache {
    private static final String TAG = "Cache";

    private static final String API_KEY = "AQEAAAABAAD_rAp4DJh05a1HAwFT3A6K";

    private static final Cache sInstance = new Cache();

    private Tinode mTinode = null;

    // Currently active topic.
    private String mTopicSelected = null;

    public static synchronized Tinode getTinode() {
        if (sInstance.mTinode == null) {
            sInstance.mTinode = new Tinode(
                "Tindroid/" + "0.0.0.1",
                API_KEY,
                BaseDb.getInstance().getStore(), null
            );
            sInstance.mTinode.setOsString(Build.VERSION.RELEASE);

            // Default types for parsing Public, Private fields of messages
            sInstance.mTinode.setDefaultTypeOfMetaPacket(VxCard.class, PrivateType.class);
            sInstance.mTinode.setMeTypeOfMetaPacket(VxCard.class);
            sInstance.mTinode.setFndTypeOfMetaPacket(VxCard.class);

            // Set device language
            sInstance.mTinode.setLanguage(Locale.getDefault().toString());

            // Keep in app to prevent garbage collection.
            RNTinodeClientModule.retainCache(sInstance);
        }

        // FirebaseMessaging fbId = FirebaseMessaging.getInstance();
        // // noinspection ConstantConditions: Google lies about getInstance not returning null.
        // if (fbId != null) {
        //     fbId.getToken().addOnSuccessListener(token -> {
        //         if (sInstance.mTinode != null) {
        //             sInstance.mTinode.setDeviceToken(token);
        //         }
        //     });
        // }
        return sInstance.mTinode;
    }

    // Invalidate existing cache.
    static void invalidate() {
        setSelectedTopicName(null);
        if (sInstance.mTinode != null) {
            sInstance.mTinode.logout();
            sInstance.mTinode = null;
        }
    }

    public static String getSelectedTopicName() {
        return sInstance.mTopicSelected;
    }

    // Save the new topic name. If the old topic is not null, unsubscribe.
    public static void setSelectedTopicName(String topicName) {
        String oldTopic = sInstance.mTopicSelected;
        sInstance.mTopicSelected = topicName;
        if (sInstance.mTinode != null && oldTopic != null && !oldTopic.equals(topicName)) {
            ComTopic topic = (ComTopic) sInstance.mTinode.getTopic(oldTopic);
            if (topic != null) {
                topic.leave();
            }
        }
    }

    // Connect to 'me' topic.
    @SuppressWarnings("unchecked")
    public static PromisedReply<ServerMessage> attachMeTopic(MeTopic.MeListener l) {
        final MeTopic<VxCard> me = getTinode().getOrCreateMeTopic();
        if (l != null) {
            me.setListener(l);
        }

        if (!me.isAttached()) {
            return me.subscribe(null, me
                    .getMetaGetBuilder()
                    .withCred()
                    .withDesc()
                    .withSub()
                    .withTags()
                    .build());
        } else {
            return new PromisedReply<>((ServerMessage) null);
        }
    }

    static PromisedReply<ServerMessage> attachFndTopic(FndTopic.FndListener<VxCard> l) {
        final FndTopic<VxCard> fnd = getTinode().getOrCreateFndTopic();
        if (l != null) {
            fnd.setListener(l);
        }

        if (!fnd.isAttached()) {
            // Don't request anything here.
            return fnd.subscribe(null, null);
        } else {
            return new PromisedReply<>((ServerMessage) null);
        }
    }
}
