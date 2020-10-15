extends Spatial

var water
var player
var speed = 0.1

# Called when the node enters the scene tree for the first time.
func _ready():
	water = get_node("Water")
	player = get_node("Player")


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	water.translate(Vector3(0, speed * delta, 0))


func _on_water_body_entered(body):
	if body == player:
		get_tree().change_scene("res://GameOver.tscn")


func _on_Palm_body_entered(body):
	if body == player:
		speed = -0.1

