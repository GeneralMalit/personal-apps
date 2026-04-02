#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    menu::MenuEvent,
    tray::{MouseButton, MouseButtonState, TrayIcon, TrayIconBuilder, TrayIconEvent},
    AppHandle, Emitter, Manager,
};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};

fn emit_copy_request(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("background") {
        let _ = window.emit("copy-request", ());
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(|app, shortcut, event| {
                    if event.state == ShortcutState::Pressed
                        && *shortcut
                            == Shortcut::new(Some(Modifiers::CONTROL | Modifiers::ALT), Code::KeyT)
                    {
                        emit_copy_request(app);
                    }
                })
                .build(),
        )
        .setup(|app| {
            let copy_item = MenuItemBuilder::with_id("copy", "Copy current time").build(app)?;
            let quit_item = MenuItemBuilder::with_id("quit", "Quit").build(app)?;
            let menu = MenuBuilder::new(app).items(&[&copy_item, &quit_item]).build()?;

            TrayIconBuilder::new()
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event: MenuEvent| match event.id().as_ref() {
                    "copy" => emit_copy_request(app),
                    "quit" => app.exit(0),
                    _ => {}
                })
                .on_tray_icon_event(|tray: &TrayIcon<_>, event: TrayIconEvent| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        emit_copy_request(tray.app_handle());
                    }
                })
                .build(app)?;

            app.global_shortcut().register(Shortcut::new(
                Some(Modifiers::CONTROL | Modifiers::ALT),
                Code::KeyT,
            ))?;

            if let Some(window) = app.get_webview_window("background") {
                let _ = window.hide();
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running timestamp-copy");
}
