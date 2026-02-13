package com.nova

import android.Manifest
import android.content.pm.PackageManager
import android.location.Location
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.nova.databinding.ActivityNavigatorBinding
import org.osmdroid.config.Configuration
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.GeoPoint
import com.nova.core.RescuePoint
import com.nova.core.RescueEngine
import org.osmdroid.views.overlay.Marker

class NavigatorActivity : AppCompatActivity() {

    private lateinit var binding: ActivityNavigatorBinding
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private var lastLocation: Location? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // OSM Configuration
        Configuration.getInstance().userAgentValue = packageName
        
        binding = ActivityNavigatorBinding.inflate(layoutInflater)
        setContentView(binding.root)

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        setupMap()
        checkLocationPermission()

        binding.centerFab.setOnClickListener {
            lastLocation?.let {
                val point = GeoPoint(it.latitude, it.longitude)
                binding.mapView.controller.animateTo(point)
            }
        }
    }

    private fun setupMap() {
        binding.mapView.setTileSource(TileSourceFactory.MAPNIK)
        binding.mapView.setMultiTouchControls(true)
        binding.mapView.controller.setZoom(12.0)
        
        // Default to a central point if no location
        val startPoint = GeoPoint(0.0, 0.0)
        binding.mapView.controller.setCenter(startPoint)
    }

    private fun checkLocationPermission() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.ACCESS_FINE_LOCATION), 101)
        } else {
            startLocationUpdates()
        }
    }

    private fun startLocationUpdates() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            fusedLocationClient.lastLocation.addOnSuccessListener { location ->
                location?.let {
                    lastLocation = it
                    updateUI(it)
                }
            }
        }
    }

    private fun updateUI(location: Location) {
        val lat = location.latitude
        val lon = location.longitude
        binding.coordinatesText.text = String.format("Lat: %.4f, Lon: %.4f", lat, lon)
        
        val zone = identifyZone(lat, lon)
        
        // Anti-Gravity Rescue Logic
        val (rescuePoint, distanceKm) = com.nova.core.RescueEngine.findNearestCivilization(lat, lon)
        val celestialGuidance = com.nova.core.RescueEngine.getCelestialGuidance(lat, lon, rescuePoint.lat, rescuePoint.lon)
        
        binding.currentZoneText.text = "📍 $zone\n🚑 NEAREST RESCUE: ${rescuePoint.name} (${String.format("%.1f", distanceKm)} km)\n✨ $celestialGuidance"

        val point = GeoPoint(lat, lon)
        binding.mapView.controller.setCenter(point)
        
        // Clear previous overlays
        binding.mapView.overlays.clear()
        
        // 1. Current Position Marker
        val marker = Marker(binding.mapView)
        marker.position = point
        marker.setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)
        marker.title = "YOU ARE HERE"
        binding.mapView.overlays.add(marker)
        
        // 2. Rescue Line
        val rescueGeo = GeoPoint(rescuePoint.lat, rescuePoint.lon)
        val line = org.osmdroid.views.overlay.Polyline()
        line.setPoints(listOf(point, rescueGeo))
        line.color = android.graphics.Color.CYAN
        line.width = 5.0f
        binding.mapView.overlays.add(line)
        
        // 3. Rescue Marker
        val rescueMarker = Marker(binding.mapView)
        rescueMarker.position = rescueGeo
        rescueMarker.setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)
        rescueMarker.title = "RESCUE: ${rescuePoint.name}"
        rescueMarker.icon = androidx.core.content.ContextCompat.getDrawable(this, android.R.drawable.ic_menu_compass) // Fallback icon
        binding.mapView.overlays.add(rescueMarker)

        binding.mapView.invalidate()
    }

    private fun identifyZone(lat: Double, lon: Double): String {
        // --- SURVIVAL ZONE LOGIC ---
        // Basic identification of major survival zones
        return when {
            // Oceans
            (lat > -60 && lat < 60 && lon > -180 && lon < -100) -> "Pacific Ocean (Open Water)"
            (lat > -40 && lat < 40 && lon > -80 && lon < -20) -> "Atlantic Ocean (Open Water)"
            (lat > -30 && lat < 30 && lon > 40 && lon < 100) -> "Indian Ocean (Open Water)"
            
            // Deserts
            (lat in 20.0..30.0 && lon in -15.0..35.0) -> "Sahara Desert (Survival Priority: Water)"
            (lat in 20.0..30.0 && lon in 40.0..60.0) -> "Arabian Desert (Survival Priority: Heat)"
            (lat in -30.0..-20.0 && lon in 115.0..145.0) -> "Australian Outback (Survival Priority: Orientation)"
            (lat in 40.0..50.0 && lon in 90.0..110.0) -> "Gobi Desert (Survival Priority: Extreme Cold/Heat)"
            
            // Forests/Tropics
            (lat in -10.0..10.0 && lon in -80.0..-50.0) -> "Amazon Rainforest (Survival Priority: Flora/Medical)"
            (lat in -5.0..5.0 && lon in 10.0..30.0) -> "Congo Basin (Survival Priority: Medical)"
            
            else -> "Detected Zone: Mainland / Unmapped Survival Area"
        }
    }

    override fun onResume() {
        super.onResume()
        binding.mapView.onResume()
    }

    override fun onPause() {
        super.onPause()
        binding.mapView.onPause()
    }
}
