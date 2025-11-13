select rusher_player_id,rusher_player_name,ydstogo,yards_gained
from plays
where rush_attempt=1




select ydstogo,avg(yards_gained) as avg_yards
from plays
where rush_attempt=1
group by ydstogo



select rusher_player_id,
	   rusher_player_name,
       count(*) as rush_attempts,
	   avg(yards_gained - (0.12588674 * ydstogo + 3.47336519)) as yards_over_expected
from plays
where rush_attempt=1
group by rusher_player_id, rusher_player_name
having count(*) >= 100
order by yards_over_expected desc;


SELECT 
	rusher_player_id,
	rusher_player_name,
	yards_gained,
	ydstogo,
 	down
from plays
where rush_attempt=1


-- Flag rows where the play is 2nd down: 1 when down=2, otherwise 0
SELECT
	rusher_player_id,
	rusher_player_name,
	down,
	CASE WHEN down = 2 THEN 1 ELSE 0 END AS is_second_down,
	CASE WHEN down = 3 THEN 1 ELSE 0 END AS is_third_down,
	CASE WHEN down = 4 THEN 1 ELSE 0 END AS is_fourth_down,
	yards_gained,
	ydstogo
FROM plays
WHERE rush_attempt = 1;
