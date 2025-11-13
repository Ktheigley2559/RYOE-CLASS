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
