for i in *.png; do
    new=$(printf "%d.jpg" "$a");
    mv $i "$new";
    let a=a+1;
done