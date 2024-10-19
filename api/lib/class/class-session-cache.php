<?php

namespace bilibili_dynamic_lottery;

/**
 * 会话缓存系统
 */
class Session_Cache
{

    const kEY_REQUEST_PROGRESS = '_request_progress';

    const BILIBILI_COOKIE = 'bilibili_cookie';

    /**
     * 获取会话缓存
     *
     * @param string $key
     * @return mixed|null 如果不存在则返回NULL
     */
    public static function get($key)
    {
        //确保已启动会话缓存
        // static::start();

        return $_SESSION[$key] ?? null;
    }

    /**
     * 设置会话缓存
     *
     * @param string $key
     * @param mixed $value
     * @return void
     */
    public static function set($key, $value)
    {
        //确保已启动会话缓存
        // static::start();

        $_SESSION[$key] = $value;
    }

    /**
     * 删除会话缓存
     *
     * @param string $key
     * @return void
     */
    public static function delete($key)
    {
        //确保已启动会话缓存
        // static::start();

        unset($_SESSION[$key]);
    }

    /**
     * 启动会话缓存
     *
     * @return void
     */
    public static function start()
    {
        //允许跨域设置COOKIE
        ini_set('session.cookie_samesite', 'None');
        //开启只允许 HTTPS 传输 Cookie
        ini_set('session.cookie_secure', '1');
        // 设置会话的最大存活时间
        ini_set('session.gc_maxlifetime', SESSION_TIMEOUT);
        // 设置会话 Cookie 的过期时间
        session_set_cookie_params(SESSION_TIMEOUT);

        if (session_status() == PHP_SESSION_NONE)
        {
            session_start();
        }
    }

    /**
     * 暂时关闭会话缓存 避免死锁
     *
     * @return void
     */
    public static function close_write()
    {
        session_write_close();
    }
}
