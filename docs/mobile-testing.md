# Mobile Testing Guide for CueTimer

## **Quick Start for Mobile Development**

### **1. Start Mobile-Optimized Dev Server**

```bash
# Kill existing dev servers
pkill -f "next dev"

# Start mobile-friendly dev server
bun run dev:mobile
```

### **2. Find Your Local IP Address**

```bash
# Linux/Mac
hostname -I | awk '{print $1}'

# Or use
ip route get 1.1.1.1 | awk '{print $7}'
```

### **3. Access from Mobile Devices**

1. **Connect mobile device to the same WiFi network** as your development
   machine
2. **Open mobile browser** (Safari on iOS, Chrome on Android)
3. **Navigate to**: `http://YOUR_LOCAL_IP:3000` (e.g.,
   `http://192.168.1.100:3000`)
4. **Test**: The app should redirect to `http://YOUR_LOCAL_IP:3000/en`

### **4. Mobile Development Checklist**

#### **✅ Basic Functionality**

- [ ] Page loads without errors
- [ ] Internationalization redirects work (`/` → `/en`)
- [ ] All interactive elements are tappable
- [ ] Navigation works correctly
- [ ] Mobile-specific navigation appears

#### **✅ Responsive Design**

- [ ] Layout adapts to mobile screens
- [ ] Text is readable without zooming
- [ ] Touch targets are at least 44px
- [ ] No horizontal scrolling
- [ ] Images scale properly

#### **✅ Performance**

- [ ] Page loads in under 3 seconds
- [ ] JavaScript doesn't block rendering
- [ ] Images are optimized
- [ ] No console errors

#### **✅ Mobile Features**

- [ ] Viewport meta tag works correctly
- [ ] PWA manifest loads
- [ ] App icons display correctly
- [ ] Theme color matches branding
- [ ] Touch gestures work

## **Network Configuration**

### **Common Network Issues**

#### **1. Firewall Blocking**

```bash
# Check if port 3000 is blocked by firewall
sudo ufw status
sudo ufw allow 3000
```

#### **2. Network Isolation**

- Ensure both devices are on the same network
- Check if mobile device has internet access
- Verify no VPN is interfering

#### **3. Router Configuration**

- Some routers block device-to-device communication
- Try enabling "guest network" features
- Check AP isolation settings

### **Advanced Testing**

#### **Chrome DevTools Mobile Simulation**

1. Open Chrome DevTools (F12)
2. Click device toggle (📱)
3. Select mobile device presets
4. Test different screen sizes and resolutions

#### **iOS Simulator Testing**

```bash
# If you have Xcode installed
open -a Simulator
```

#### **Android Studio Emulator**

```bash
# Launch Android Studio and use AVD Manager
# Or use command line
emulator -avd <device_name>
```

## **Debugging Mobile Issues**

### **iOS Safari Debugging**

1. **Enable Web Inspector**: Settings → Safari → Advanced → Web Inspector
2. **Connect iPhone to Mac** via USB
3. **Open Safari on Mac**: Develop → [iPhone Name] → [URL]
4. **Use Web Inspector** like Chrome DevTools

### **Android Chrome Debugging**

1. **Enable USB Debugging**: Settings → Developer Options → USB Debugging
2. **Connect Android to computer** via USB
3. **Open Chrome DevTools**: chrome://inspect
4. **Select your device** and start debugging

### **Common Mobile Error Codes**

| Error                      | Cause                          | Solution                           |
| -------------------------- | ------------------------------ | ---------------------------------- |
| `ERR_CONNECTION_REFUSED`   | Server not running or wrong IP | Check server status and IP address |
| `ERR_CONNECTION_TIMED_OUT` | Network connectivity issue     | Verify WiFi connection             |
| `ERR_SSL_PROTOCOL_ERROR`   | HTTPS issues on HTTP           | Use HTTP in mobile browser         |
| `ERR_ADDRESS_UNREACHABLE`  | Network isolation              | Check router/AP isolation settings |

## **Performance Optimization**

### **Mobile-Specific Optimizations**

#### **Bundle Analysis**

```bash
bun run perf:bundle
```

#### **Lighthouse Mobile Testing**

```bash
bun run perf:audit
```

#### **Network Throttling Testing**

1. Open Chrome DevTools
2. Go to Network tab
3. Throttle to "Slow 3G" or "Fast 3G"
4. Test mobile performance

## **Production Deployment**

### **Mobile-Ready Build**

```bash
# Build optimized for production
bun run build

# Test production build locally
bun run start
```

### **PWA Verification**

```bash
# Test PWA features
curl -I https://your-domain.com/manifest.json
```

## **Troubleshooting**

### **App Works on Desktop but Not Mobile**

1. **Check Network Binding**

   ```bash
   ss -tlnp | grep 3000
   # Should show: LISTEN *:3000
   ```

2. **Verify IP Address**

   ```bash
   curl http://YOUR_IP:3000
   # Should return 307 redirect to /en
   ```

3. **Check CSP Headers**

   ```bash
   curl -I http://YOUR_IP:3000/en | grep -i content-security
   ```

4. **Test Mobile Meta Tags**
   ```bash
   curl -s http://YOUR_IP:3000/en | grep -i viewport
   ```

### **Internationalization Issues**

1. **Verify Middleware Configuration**

   ```bash
   curl -I http://YOUR_IP:3000/
   # Should show 307 redirect with locale cookie
   ```

2. **Check Locale Detection**
   - Test with different browser languages
   - Verify locale cookie handling

## **Security Considerations**

### **Development vs Production**

- Development uses relaxed CSP for easier debugging
- Production should have stricter CSP policies
- Consider HTTPS for production mobile access

### **Mobile-Specific Headers**

- `X-Mobile-Device` header added by middleware
- Mobile-specific cache controls
- Touch-friendly interface considerations

---

## **Quick Test Commands**

```bash
# Test server accessibility
curl -I http://$(hostname -I | awk '{print $1}'):3000

# Test mobile meta tags
curl -s http://$(hostname -I | awk '{print $1}'):3000/en | grep -i viewport

# Test CSP headers
curl -I http://$(hostname -I | awk '{print $1}'):3000/en | grep -i content-security

# Test PWA manifest
curl -s http://$(hostname -I | awk '{print $1}'):3000/manifest.json | jq .
```

**Note**: Replace `$(hostname -I | awk '{print $1}')` with your actual local IP
address.
